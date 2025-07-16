import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  CatalogueInspectionsStateEnum,
  CatalogueProcessesTypeEnum,
  CatalogueTypeEnum,
  CommonRepositoryEnum,
  ConfigEnum,
  CoreRepositoryEnum,
} from '@utils/enums';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import {
  AssignmentEntity,
  EstablishmentAddressEntity,
  EstablishmentContactPersonEntity,
  EstablishmentEntity,
  InspectionEntity,
  InternalDpaUserEntity,
  InternalUserEntity,
  ProcessEntity,
} from '@modules/core/entities';
import { PaginationDto } from '@utils/dto';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import { FindTouristGuideDto } from '@modules/core/shared-core/dto/tourist-guide/find-tourist-guide.dto';
import {
  CreateProcessAgencyDto,
  UpdateProcessAgencyDto,
} from '@modules/core/roles/external/dto/process-agency';
import { CreateStep1Dto, CreateStep2Dto } from '@modules/core/shared-core/dto/process';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { addDays, differenceInDays, set, startOfDay } from 'date-fns';
import { CreateInspectionDto } from '@modules/core/shared-core/dto/process/create-inspection.dto';
import { UserEntity } from '@auth/entities';

@Injectable()
export class ProcessService {
  private paginateFilterService: PaginateFilterService<ProcessEntity>;

  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly repository: Repository<ProcessEntity>,
    @Inject(CoreRepositoryEnum.ESTABLISHMENT_REPOSITORY)
    private readonly establishmentRepository: Repository<EstablishmentEntity>,
    @Inject(CoreRepositoryEnum.INTERNAL_USER_REPOSITORY)
    private readonly internalUserRepository: Repository<InternalUserEntity>,
    @Inject(CoreRepositoryEnum.INTERNAL_DPA_USER_REPOSITORY)
    private readonly internalDpaUserRepository: Repository<InternalDpaUserEntity>,
    @Inject(CommonRepositoryEnum.CATALOGUE_REPOSITORY)
    private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(CoreRepositoryEnum.INSPECTION_REPOSITORY)
    private readonly inspectionRepository: Repository<InspectionEntity>,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.repository);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, []);
  }

  async findOne(id: string, options: FindTouristGuideDto): Promise<ProcessEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: options.relations,
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return entity;
  }

  async create(payload: CreateProcessAgencyDto): Promise<ProcessEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async update(id: string, payload: UpdateProcessAgencyDto): Promise<ProcessEntity> {
    const entity = await this.findEntityOrThrow(id);

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<ProcessEntity> {
    const entity = await this.findEntityOrThrow(id);

    return await this.repository.softRemove(entity);
  }

  private async findEntityOrThrow(id: string): Promise<ProcessEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) throw new NotFoundException('Registro no encontrado');

    return entity;
  }

  async createStep1(payload: CreateStep1Dto): Promise<ProcessEntity> {
    let process: ProcessEntity | null = null;

    if (payload?.processId) {
      process = await this.repository.findOneBy({ id: payload?.processId });
    }

    if (!process) {
      process = this.repository.create();
    }

    process.startedAt = new Date();
    process.typeId = payload.type.id;

    if (payload.legalEntity) {
      process.legalEntityId = payload.legalEntity.id;
      process.hasTouristActivityDocument = payload.hasTouristActivityDocument;
      process.hasPersonDesignation = payload.hasPersonDesignation;
    }

    return await this.repository.save(process);
  }

  async createStep2(payload: CreateStep2Dto): Promise<ProcessEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const processRepository = manager.getRepository(ProcessEntity);

      const process = await processRepository.findOneBy({ id: payload?.processId });

      if (!process) {
        throw new NotFoundException('Trámite no encontrado');
      }

      process.establishmentId = payload.establishment.id;
      process.totalMen = payload.establishment.totalMen;
      process.totalWomen = payload.establishment.totalWomen;
      process.totalMenDisability = payload.establishment.totalMenDisability;
      process.totalWomenDisability = payload.establishment.totalWomenDisability;

      await this.saveEstablishment(payload, manager);
      await this.saveEstablishmentAddress(payload, manager);
      await this.saveEstablishmentContactPerson(payload, manager);

      return await processRepository.save(process);
    });
  }

  async createExternalInspection(payload: CreateInspectionDto, user: UserEntity) {
    const actualInspection = await this.inspectionRepository.findOne({
      where: { processId: payload.processId, isCurrent: true },
      relations: { state: true },
    });

    if (!actualInspection) {
      throw new NotFoundException('Inspección no encontrada');
    }

    if (!actualInspection?.state) {
      throw new NotFoundException('Estado inspección no encontrado');
    }

    const inspectionAt = set(payload.inspectionAt, {
      hours: 23,
      minutes: 59,
      seconds: 59,
    });

    if (differenceInDays(startOfDay(inspectionAt), startOfDay(new Date())) <= 0) {
      throw new BadRequestException(
        `No puede agendar una fecha igual o anterior a la fecha actual`,
      );
    }

    if (
      actualInspection.state.code !== CatalogueInspectionsStateEnum.autogenerated &&
      actualInspection.state.code !== CatalogueInspectionsStateEnum.requested
    ) {
      throw new BadRequestException(
        `No puede agendar una fecha con estado ${actualInspection.state.name}`,
      );
    }

    if (actualInspection?.state.code === CatalogueInspectionsStateEnum.requested) {
      actualInspection.inspectionAt = inspectionAt;
      await this.inspectionRepository.save(actualInspection);

      return actualInspection;
    }

    await this.inspectionRepository
      .createQueryBuilder()
      .update(InspectionEntity)
      .set({ isCurrent: false })
      .where('process_id = :processId', { processId: payload.processId })
      .execute();

    const state = await this.catalogueRepository.findOne({
      where: {
        code: CatalogueInspectionsStateEnum.requested,
        type: CatalogueTypeEnum.inspections_state,
      },
    });

    const inspection = this.inspectionRepository.create();
    inspection.processId = payload.processId;
    if (state) inspection.stateId = state.id;
    if (user) inspection.userId = user.id;
    inspection.isCurrent = true;
    inspection.inspectionAt = inspectionAt;
    inspection.observation = 'Fecha solicitada por el Usuario Externo';

    return this.inspectionRepository.save(inspection);
  }

  async createInternalInspection(payload: CreateInspectionDto, user: UserEntity) {
    const actualInspection = await this.inspectionRepository.findOne({
      where: { processId: payload.processId, isCurrent: true },
      relations: { state: true },
    });

    if (!actualInspection) {
      throw new NotFoundException('Registro no encontrado');
    }

    if (!actualInspection?.state) {
      throw new NotFoundException('Estado inspección no encontrado');
    }

    const inspectionAt = payload.inspectionAt;

    if (differenceInDays(inspectionAt, new Date()) < 0) {
      throw new BadRequestException(`No puede agendar una fecha anterior a la fecha actual`);
    }

    if (actualInspection.state.code === CatalogueInspectionsStateEnum.rescheduled_2) {
      throw new BadRequestException({
        error: 'Ya no puede volver a reagendar',
        message: 'Ya se ha reagendado en 2 ocasiones',
      });
    }

    await this.inspectionRepository
      .createQueryBuilder()
      .update(InspectionEntity)
      .set({ isCurrent: false })
      .where('process_id = :processId', { processId: payload.processId })
      .execute();

    const states = await this.catalogueRepository.find({
      where: { type: CatalogueTypeEnum.inspections_state },
    });

    let state: undefined | CatalogueEntity = undefined;
    let observation: string = '';

    switch (actualInspection?.state.code) {
      case CatalogueInspectionsStateEnum.autogenerated:
      case CatalogueInspectionsStateEnum.autogenerated_2:
        state = states.find((state) => state.code === CatalogueInspectionsStateEnum.scheduled);
        observation = 'Fecha agendada por el Técnico Zonal';
        break;

      case CatalogueInspectionsStateEnum.requested:
        if (payload.state === 'confirmed') {
          state = states.find((state) => state.code === CatalogueInspectionsStateEnum.confirmed);
          observation = 'Fecha confirmada por el Técnico Zonal';
        } else {
          state = states.find((state) => state.code === CatalogueInspectionsStateEnum.scheduled);
          observation = 'Fecha agendada por el Técnico Zonal';
        }
        break;

      case CatalogueInspectionsStateEnum.confirmed:
      case CatalogueInspectionsStateEnum.scheduled:
        state = states.find((state) => state.code === CatalogueInspectionsStateEnum.rescheduled_1);
        observation = 'Fecha re-agendada por el Técnico Zonal';
        break;

      case CatalogueInspectionsStateEnum.rescheduled_1:
        state = states.find((state) => state.code === CatalogueInspectionsStateEnum.rescheduled_2);
        observation = 'Fecha re-agendada por segunda ocasión por el Técnico Zonal';
        break;
    }

    const inspection = this.inspectionRepository.create();

    inspection.processId = payload.processId;
    inspection.isCurrent = true;
    inspection.inspectionAt = inspectionAt;
    inspection.observation = observation;

    if (state) inspection.stateId = state.id;
    if (user) inspection.userId = user.id;

    return this.inspectionRepository.save(inspection);
  }

  async saveAutoInspection(
    payload: CreateProcessAgencyDto,
    manager: EntityManager,
    user: UserEntity,
  ) {
    const inspectionRepository = manager.getRepository(InspectionEntity);
    const catalogueRepository = manager.getRepository(CatalogueEntity);
    const state = await catalogueRepository.findOne({
      where: {
        code: CatalogueInspectionsStateEnum.autogenerated,
        type: CatalogueTypeEnum.inspections_state,
      },
    });

    let inspectionAt = new Date();

    switch (payload.type.code) {
      case CatalogueProcessesTypeEnum.registration:
        inspectionAt = addDays(inspectionAt, 84);
        break;

      case CatalogueProcessesTypeEnum.new_classification:
        inspectionAt = addDays(inspectionAt, 84);
        break;

      case CatalogueProcessesTypeEnum.new_activity:
        inspectionAt = addDays(inspectionAt, 84);
        break;

      case CatalogueProcessesTypeEnum.readmission:
        inspectionAt = addDays(inspectionAt, 84);
        break;

      case CatalogueProcessesTypeEnum.reclassification:
        inspectionAt = addDays(inspectionAt, 42);
        break;

      case CatalogueProcessesTypeEnum.recategorization:
        inspectionAt = addDays(inspectionAt, 42);
        break;
      default:
        throw new BadRequestException(`Tipo de trámite no encontrado ${payload.type.name}`);
    }

    let inspection = await inspectionRepository.findOne({
      where: { processId: payload.processId },
    });

    if (!inspection) {
      inspection = inspectionRepository.create();
    }

    inspection.processId = payload.processId;
    inspection.isCurrent = true;
    inspection.observation = 'Fecha auto generada por el sistema';

    if (state) inspection.stateId = state.id;
    if (user) inspection.userId = user.id;

    inspection.inspectionAt = set(inspectionAt, {
      hours: 23,
      minutes: 23,
      seconds: 59,
      milliseconds: 0,
    });

    return inspectionRepository.save(inspection);
  }

  async saveAutoAssignment(processId: string, dpaId: string, manager: EntityManager) {
    const assignmentRepository = manager.getRepository(AssignmentEntity);

    let assignment = await assignmentRepository.findOne({
      where: { processId },
    });

    if (!assignment) {
      assignment = assignmentRepository.create();
    }

    assignment.processId = processId;
    assignment.isCurrent = true;
    assignment.registeredAt = new Date();
    assignment.dpaId = dpaId;
    const availableInternalUser = await this.getAvailableInternalUser(dpaId);
    if (availableInternalUser) assignment.internalUser = availableInternalUser;

    return assignmentRepository.save(assignment);
  }

  private async saveEstablishment(payload: CreateStep2Dto, manager: EntityManager) {
    const establishmentRepository = manager.getRepository(EstablishmentEntity);

    const establishment = await establishmentRepository.findOneBy({
      id: payload.establishment.id,
    });

    if (!establishment) {
      throw new NotFoundException('Establecimiento no encontrado');
    }

    establishment.webPage = payload.establishment.webPage;

    return establishmentRepository.save(establishment);
  }

  private async saveEstablishmentAddress(payload: CreateStep2Dto, manager: EntityManager) {
    const establishmentAddressRepository = manager.getRepository(EstablishmentAddressEntity);

    let establishmentAddress = await establishmentAddressRepository.findOneBy({
      processId: payload.processId,
    });

    if (!establishmentAddress) {
      establishmentAddress = establishmentAddressRepository.create();
    }

    await establishmentAddressRepository
      .createQueryBuilder()
      .update(EstablishmentAddressEntity)
      .set({ isCurrent: false })
      .where('establishment_id = :establishmentId', { establishmentId: payload.establishment.id })
      .execute();

    establishmentAddress.processId = payload.processId;
    establishmentAddress.establishmentId = payload.establishment.id;
    establishmentAddress.isCurrent = true;
    establishmentAddress.provinceId = payload.establishmentAddress.province.id;
    establishmentAddress.cantonId = payload.establishmentAddress.canton.id;
    establishmentAddress.parishId = payload.establishmentAddress.parish.id;
    establishmentAddress.mainStreet = payload.establishmentAddress.mainStreet;
    establishmentAddress.numberStreet = payload.establishmentAddress.numberStreet;
    establishmentAddress.secondaryStreet = payload.establishmentAddress.secondaryStreet;
    establishmentAddress.referenceStreet = payload.establishmentAddress.referenceStreet;
    establishmentAddress.latitude = payload.establishmentAddress.latitude;
    establishmentAddress.longitude = payload.establishmentAddress.longitude;

    return establishmentAddressRepository.save(establishmentAddress);
  }

  private async saveEstablishmentContactPerson(payload: CreateStep2Dto, manager: EntityManager) {
    const establishmentContactPersonRepository = manager.getRepository(
      EstablishmentContactPersonEntity,
    );

    let establishmentContactPerson = await establishmentContactPersonRepository.findOneBy({
      processId: payload.processId,
    });

    if (!establishmentContactPerson) {
      establishmentContactPerson = establishmentContactPersonRepository.create();
    }

    await establishmentContactPersonRepository
      .createQueryBuilder()
      .update(EstablishmentContactPersonEntity)
      .set({ isCurrent: false })
      .where('establishment_id = :establishmentId', { establishmentId: payload.establishment.id })
      .execute();

    establishmentContactPerson.processId = payload.processId;
    establishmentContactPerson.establishmentId = payload.establishment.id;
    establishmentContactPerson.identification = payload.establishmentContactPerson.identification;
    establishmentContactPerson.name = payload.establishmentContactPerson.name;
    establishmentContactPerson.email = payload.establishmentContactPerson.email;
    establishmentContactPerson.phone = payload.establishmentContactPerson.phone;
    establishmentContactPerson.secondaryPhone = payload.establishmentContactPerson.secondaryPhone;

    return establishmentContactPersonRepository.save(establishmentContactPerson);
  }

  private async getAvailableInternalUser(dpaId: string): Promise<InternalUserEntity | null> {
    // Paso 1: Buscar un usuario disponible sin proceso asignado
    let internalUser = await this.internalUserRepository.findOne({
      where: { isAvailable: true, internalDpaUser: { hasProcess: false, dpaId } },
    });

    // Paso 2: Si no hay, resetear `hasProcess` a false y volver a intentar
    if (!internalUser) {
      // Reintentar obtener un usuario disponible
      internalUser = await this.internalUserRepository.findOne({
        where: { isAvailable: true, internalDpaUser: { hasProcess: false, dpaId } },
      });
    }

    // Paso 3: Si se encontró uno, actualizar su estado a hasProcess = true
    if (internalUser) {
      await this.internalDpaUserRepository
        .createQueryBuilder()
        .update(InternalDpaUserEntity)
        .set({ hasProcess: true })
        .where('dpa_id = :dpaId AND internal_user_id = :internalUserId', {
          dpaId,
          internalUserId: internalUser.id,
        })
        .execute();
    }

    return internalUser;
  }
}
