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
import { ResponseHttpInterface } from '@utils/interfaces';
import {
  CadastreEntity,
  CadastreStateEntity,
  ProcessAgencyEntity,
  ProcessEntity,
  TouristGuideEntity,
} from '@modules/core/entities';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import { CreateProcessAgencyDto } from '@modules/core/roles/external/dto/process-agency';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import { UserEntity } from '@auth/entities';
import { addDays, set } from 'date-fns';
import { MailService } from '@modules/common/mail/mail.service';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { InternalPdfService } from '@modules/reports/pdf/internal-pdf.service';

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

  async createRegistration(
    payload: CreateProcessAgencyDto,
    user: UserEntity,
  ): Promise<ResponseHttpInterface> {
    return await this.dataSource.transaction(async (manager) => {
      const process = await this.saveProcess(payload, manager);

      await this.saveProcessAgency(payload, manager);

      await this.saveTouristGuides(payload, manager);

      await this.processService.saveAutoInspection(payload, manager, user);

      await this.processService.saveAutoAssignment(
        payload.processId,
        process.establishmentAddress.provinceId,
        manager,
      );

      const cadastre = await this.saveCadastre(payload.processId, manager);

      const responseSendEmail = await this.sendRegistrationCertificateEmail(cadastre);

      if (responseSendEmail) {
        return {
          data: cadastre,
          title: responseSendEmail.title,
          message: responseSendEmail.message,
        };
      }

      return {
        data: cadastre,
        title:
          'El certificado de registro de turismo ha sido enviado a la cuenta de correo electrónico registrado y en la plataforma SITURIN, en la sección de descargas.',
        message:
          'Recuerde que puede solicitar la primera inspección, ingresando al sistema SITURIN antes de los 84 días calendario, contados a partir de la emisión del certificado de registro',
      };
    });
  }

  private async saveProcess(
    payload: CreateProcessAgencyDto,
    manager: EntityManager,
  ): Promise<ProcessEntity> {
    const processRepository = manager.getRepository(ProcessEntity);
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
    process.inspectionExpirationAt = set(addDays(new Date(), 114), {
      hours: 23,
      minutes: 23,
      seconds: 59,
      milliseconds: 0,
    });

    return await processRepository.save(process);
  }

  private async saveProcessAgency(
    payload: CreateProcessAgencyDto,
    manager: EntityManager,
  ): Promise<ProcessAgencyEntity> {
    const processAgencyRepository = manager.getRepository(ProcessAgencyEntity);
    let processAgency = await processAgencyRepository.findOneBy({ processId: payload.processId });

    if (!processAgency) {
      processAgency = processAgencyRepository.create();
    }

    processAgency.processId = payload.processId;
    processAgency.permanentPhysicalSpaceId = payload.permanentPhysicalSpace.id;
    processAgency.totalAccreditedStaffLanguage = payload.totalAccreditedStaffLanguage;
    processAgency.percentageAccreditedStaffLanguage = payload.percentageAccreditedStaffLanguage;

    return await processAgencyRepository.save(processAgency);
  }

  private async saveTouristGuides(
    payload: CreateProcessAgencyDto,
    manager: EntityManager,
  ): Promise<boolean> {
    const touristGuideRepository = manager.getRepository(TouristGuideEntity);

    for (const item of payload.touristGuides) {
      try {
        const touristGuide = touristGuideRepository.create();
        touristGuide.processId = payload.processId;
        touristGuide.isGuide = item.isGuide;
        touristGuide.identification = item.identification;
        touristGuide.name = item.name;

        await touristGuideRepository.save(touristGuide);
      } catch (error: unknown) {
        let errorMessage = 'Error desconocido';

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        throw new BadRequestException({
          error: errorMessage,
          message: `Error guardando Guía de Turismo: ${item.name || item.identification}`,
        });
      }
    }

    return true;
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

  async sendRegistrationCertificateEmail(cadastre: CadastreEntity) {
    const process = await this.processRepository.findOne({
      where: { id: cadastre.processId },
      relations: {
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

    const recipients = [user.email, process.establishmentContactPerson.email].filter((email) => {
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
      subject: `Registro de Turismo ${cadastre.registerNumber}`,
      template: MailTemplateEnum.INTERNAL_REGISTRATION_CERTIFICATE,
      attachments: [{ file: pdf, filename: `${cadastre.registerNumber}.pdf` }],
    };

    await this.mailService.sendMail(mailData);
  }
}
