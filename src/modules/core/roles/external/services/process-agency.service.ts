import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  AuthRepositoryEnum,
  CatalogueActivitiesCodeEnum,
  CatalogueCadastresStateEnum,
  CatalogueTypeEnum,
  ConfigEnum,
  CoreRepositoryEnum,
  MailTemplateEnum,
} from '@utils/enums';
import { ResponseHttpInterface, ServiceResponseHttpInterface } from '@utils/interfaces';
import {
  CadastreEntity,
  CadastreStateEntity,
  ProcessAgencyEntity,
  ProcessEntity,
} from '@modules/core/entities';
import { PaginationDto } from '@utils/dto';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import { FindTouristGuideDto } from '@modules/core/shared-core/dto/tourist-guide/find-tourist-guide.dto';
import {
  CreateProcessAgencyDto,
  UpdateProcessAgencyDto,
} from '@modules/core/roles/external/dto/process-agency';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import { UserEntity } from '@auth/entities';
import { addDays, set } from 'date-fns';
import { MailService } from '@modules/common/mail/mail.service';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { InternalPdfService } from '@modules/reports/pdf/internal-pdf.service';
import { isEmail } from 'class-validator';

@Injectable()
export class ProcessAgencyService {
  private paginateFilterService: PaginateFilterService<ProcessAgencyEntity>;

  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly processRepository: Repository<ProcessEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_AGENCY_REPOSITORY)
    private readonly processAgencyRepository: Repository<ProcessAgencyEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    private readonly processService: ProcessService,
    private readonly internalPdfService: InternalPdfService,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.processAgencyRepository);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, ['process']);
  }

  async findOne(id: string, options: FindTouristGuideDto): Promise<ProcessAgencyEntity> {
    const entity = await this.processAgencyRepository.findOne({
      where: { id },
      relations: options.relations,
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return entity;
  }

  async create(payload: CreateProcessAgencyDto): Promise<ProcessAgencyEntity> {
    const entity = this.processAgencyRepository.create(payload);

    return await this.processAgencyRepository.save(entity);
  }

  async update(id: string, payload: UpdateProcessAgencyDto): Promise<ProcessAgencyEntity> {
    const entity = await this.findEntityOrThrow(id);

    this.processAgencyRepository.merge(entity, payload);

    return await this.processAgencyRepository.save(entity);
  }

  async delete(id: string): Promise<ProcessAgencyEntity> {
    const entity = await this.findEntityOrThrow(id);

    return await this.processAgencyRepository.softRemove(entity);
  }

  async createRegistration(
    payload: CreateProcessAgencyDto,
    user: UserEntity,
  ): Promise<ResponseHttpInterface> {
    return await this.dataSource.transaction(async (manager) => {
      const processRepository = manager.getRepository(ProcessEntity);
      const processAgencyRepository = manager.getRepository(ProcessAgencyEntity);
      const catalogueRepository = manager.getRepository(CatalogueEntity);

      const process = await processRepository.findOne({
        where: { id: payload.processId },
        relations: { establishmentAddress: true },
      });
      // review agregar enum para code y type
      const state = await catalogueRepository.findOneBy({
        code: 'pendiente_inspeccion_1',
        type: 'tramite_estados',
      });

      if (!process) {
        throw new NotFoundException('Trámite no encontrado');
      }

      if (state) process.stateId = state.id;

      process.activityId = payload.activity.id;
      process.classificationId = payload.classification.id;
      process.categoryId = payload.category.id;
      process.hasLandUse = payload.hasLandUse;
      process.registeredAt = new Date();
      process.endedAt = new Date();
      process.isProtectedArea = payload.isProtectedArea;
      process.hasProtectedAreaContract = payload.hasProtectedAreaContract;

      await this.processService.saveAutoInspection(payload, manager, user);
      await this.processService.saveAutoAssignment(
        payload.processId,
        process.establishmentAddress.provinceId,
        manager,
      );

      process.inspectionExpirationAt = set(addDays(new Date(), 114), {
        hours: 23,
        minutes: 23,
        seconds: 59,
        milliseconds: 0,
      });

      let processAgency = await processAgencyRepository.findOneBy({ processId: payload.processId });

      if (!processAgency) {
        processAgency = processAgencyRepository.create();
      }

      processAgency.processId = payload.processId;
      processAgency.permanentPhysicalSpaceId = payload.permanentPhysicalSpace.id;
      processAgency.totalAccreditedStaffLanguage = payload.totalAccreditedStaffLanguage;
      processAgency.percentageAccreditedStaffLanguage = payload.percentageAccreditedStaffLanguage;

      await processAgencyRepository.save(processAgency);

      const cadastre = await this.saveCadastre(payload.processId, manager);

      const responseSendEmail = await this.sendRegistrationCertificateEmail(cadastre);

      console.log(responseSendEmail);

      if (responseSendEmail) {
        return {
          data: await processRepository.save(process),
          title: responseSendEmail.title,
          message: responseSendEmail.message,
        };
      }

      return {
        data: await processRepository.save(process),
        title: '',
        message: '',
      };
    });
  }

  private async saveCadastre(processId: string, manager: EntityManager): Promise<CadastreEntity> {
    const cadastreRepository = manager.getRepository(CadastreEntity);
    const cadastreStateRepository = manager.getRepository(CadastreStateEntity);
    const processRepository = manager.getRepository(ProcessEntity);
    const catalogueRepository = manager.getRepository(CatalogueEntity);

    const process = await processRepository.findOne({
      where: { id: processId },
      relations: { activity: true, establishment: { ruc: true }, establishmentAddress: true },
    });

    const state = await catalogueRepository.findOne({
      where: {
        code: CatalogueCadastresStateEnum.pending_1,
        type: CatalogueTypeEnum.cadastres_state,
      },
    });

    if (!process) {
      throw new NotFoundException('Trámite no encontrado');
    }

    const establishmentNumber = process?.establishment.number.padStart(3, '0');

    const cadastreLast = await cadastreRepository
      .createQueryBuilder('cadastres')
      .innerJoin('cadastres.process', 'processes')
      .innerJoin('processes.activity', 'activities')
      .where('activities.code IN (:...activityCodes)', {
        activityCodes: [
          CatalogueActivitiesCodeEnum.agency_continent,
          CatalogueActivitiesCodeEnum.agency_galapagos,
        ],
      })
      .orderBy('processes.id', 'ASC')
      .addOrderBy('SUBSTRING(cadastres.register_number, 20)', 'DESC')
      .getOne();

    let sequential = '1';

    if (cadastreLast) {
      sequential = (parseInt(cadastreLast.registerNumber.substring(20)) + 1).toString();
    }

    sequential = `4${sequential.padStart(6, '0')}`;
    let cadastre = await cadastreRepository.findOneBy({ processId: process.id });

    if (!cadastre) {
      cadastre = cadastreRepository.create();
    }

    cadastre.processId = process.id;
    cadastre.registerNumber = `${process?.establishment.ruc.number}.${establishmentNumber}.${sequential}`;
    cadastre.registeredAt = new Date();
    cadastre.systemOrigin = 'SITURIN V3';

    cadastre = await cadastreRepository.save(cadastre);

    let cadastreState = await cadastreStateRepository.findOneBy({ cadastreId: cadastre.id });

    if (!cadastreState) {
      cadastreState = cadastreStateRepository.create();
      cadastreState.cadastreId = cadastre.id;

      cadastreState.isCurrent = true;

      if (state) cadastreState.stateId = state.id;

      await cadastreStateRepository.save(cadastreState);
    }

    return cadastre;
  }

  private async findEntityOrThrow(id: string): Promise<ProcessAgencyEntity> {
    const entity = await this.processAgencyRepository.findOneBy({ id });

    if (!entity) throw new NotFoundException('Registro no encontrado');

    return entity;
  }

  async sendRegistrationCertificateEmail(cadastre: CadastreEntity) {
    const process = await this.processRepository.findOne({
      where: { id: cadastre.processId },
      relations: {
        cadastre: true,
        establishment: { ruc: true },
        establishmentAddress: true,
        establishmentContactPerson: true,
      },
    });

    const user = await this.userRepository.findOneBy({
      identification: process?.establishment.ruc.number,
    });

    if (!process) {
      throw new NotFoundException('Trámite no encontrado');
    }

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const data = {
      ruc: process?.establishment.ruc.number,
      registerNumber: cadastre.registerNumber,
    };

    const failedRecipients: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // user.email, process.establishmentContactPerson.email,
    const recipients = ['asd@'].filter((email) => {
      if (emailRegex.test(email)) {
        return true;
      }

      failedRecipients.push(email);
      return false;
    });

    if (recipients.length === 0) {
      return {
        title: 'No se pudo entregar a ningun correo',
        message: failedRecipients,
      };
    }

    if (recipients.length === 0) {
      return {
        title: 'No se pudo entregar a a los siguientes correos',
        message: failedRecipients,
      };
    }

    const pdf = await this.internalPdfService.generateUsersReportBuffer();

    const mailData: MailDataInterface = {
      to: recipients,
      data,
      subject: `Registro de Turismo ${process.cadastre.registerNumber}`,
      template: MailTemplateEnum.INTERNAL_REGISTRATION_CERTIFICATE,
      attachments: [{ file: pdf, filename: `${process.cadastre.registerNumber}.pdf` }],
    };

    await this.mailService.sendMail(mailData);
  }
}
