import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { addDays, differenceInDays, format, set, startOfDay } from 'date-fns';
import {
  CatalogueInspectionsStateEnum,
  CatalogueProcessesTypeEnum,
  CatalogueTypeEnum,
  CommonRepositoryEnum,
  ConfigEnum,
  CoreRepositoryEnum,
} from '@utils/enums';
import {
  AdventureTourismModalityEntity,
  AssignmentEntity,
  BreachCauseEntity,
  EstablishmentAddressEntity,
  EstablishmentContactPersonEntity,
  EstablishmentEntity,
  InactivationCauseEntity,
  InspectionEntity,
  InternalDpaUserEntity,
  InternalUserEntity,
  ProcessEntity,
  RegulationResponseEntity,
  TouristGuideEntity,
  TouristTransportCompanyEntity,
} from '@modules/core/entities';
import {
  BreachCauseDto,
  CreateInspectionDto,
  CreateStep1Dto,
  CreateStep2Dto,
  InactivationCauseDto,
  TouristGuideDto,
} from '@modules/core/shared-core/dto/process';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { UserEntity } from '@auth/entities';
import { FileService } from '@modules/common/file/file.service';
import { CreateRegulationResponseDto } from '@modules/core/shared-core/dto/process/create-regulation-response.dto';
import { CreateAdventureTourismModalityDto } from '@modules/core/shared-core/dto/adventure-tourism-modality';
import { TransportDto } from '@modules/core/roles/external/dto/process-ctc/transport';
import { CatalogueDto } from '@modules/common/catalogue/dto';

@Injectable()
export class ProcessService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly processRepository: Repository<ProcessEntity>,
    @Inject(CoreRepositoryEnum.INTERNAL_USER_REPOSITORY)
    private readonly internalUserRepository: Repository<InternalUserEntity>,
    @Inject(CoreRepositoryEnum.INTERNAL_DPA_USER_REPOSITORY)
    private readonly internalDpaUserRepository: Repository<InternalDpaUserEntity>,
    @Inject(CommonRepositoryEnum.CATALOGUE_REPOSITORY)
    private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(CoreRepositoryEnum.INSPECTION_REPOSITORY)
    private readonly inspectionRepository: Repository<InspectionEntity>,
    private readonly fileService: FileService,
  ) {}

  async createStep1(payload: CreateStep1Dto): Promise<ProcessEntity> {
    let process: ProcessEntity | null = null;

    if (payload?.processId) {
      process = await this.processRepository.findOneBy({ id: payload?.processId });
    }

    if (!process) {
      process = this.processRepository.create();
    }

    process.startedAt = new Date();
    process.typeId = payload.type.id;

    if (payload.legalEntity) {
      process.legalEntityId = payload.legalEntity.id;
      process.hasTouristActivityDocument = payload.hasTouristActivityDocument;
      process.hasPersonDesignation = payload.hasPersonDesignation;
    }

    return await this.processRepository.save(process);
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

    // review aumentar el igual porque no debe dejar agenar el mismo dia
    if (differenceInDays(startOfDay(inspectionAt), startOfDay(new Date())) < 0) {
      throw new BadRequestException(
        `No puede agendar una fecha igual o anterior a la fecha actual`,
      );
    }

    if (
      actualInspection.state.code !== CatalogueInspectionsStateEnum.autogenerated_1 &&
      actualInspection.state.code !== CatalogueInspectionsStateEnum.autogenerated_2 &&
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
      throw new NotFoundException('Inspeccion Actual no encontrada');
    }

    if (!actualInspection?.state) {
      throw new NotFoundException('Estado inspección no encontrado');
    }

    const process = await this.processRepository.findOne({
      where: { id: payload.processId },
    });

    if (!process) {
      throw new NotFoundException('Trámite no encontrado');
    }

    const inspectionAt = payload.inspectionAt;

    if (
      differenceInDays(startOfDay(inspectionAt), startOfDay(process.inspectionExpirationAt)) > 0
    ) {
      throw new BadRequestException({
        error: 'No se puede agendar',
        message: `No puede agendar una fecha fuera posterior a la fecha límite ${format(process.inspectionExpirationAt, 'yyyy-MM-dd')}`,
      });
    }

    if (differenceInDays(inspectionAt, new Date()) < 0) {
      throw new BadRequestException({
        error: 'No se puede agendar',
        message: 'No puede agendar una fecha anterior a la fecha actual',
      });
    }

    if (
      (actualInspection.state.code === CatalogueInspectionsStateEnum.autogenerated_1 ||
        actualInspection.state.code === CatalogueInspectionsStateEnum.autogenerated_2) &&
      differenceInDays(actualInspection.inspectionAt, new Date()) > 0
    ) {
      throw new BadRequestException({
        error: 'No se puede agendar',
        message: 'Mientras el usuario no solicite una inspección o se cumpla la fecha',
      });
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
      case CatalogueInspectionsStateEnum.autogenerated_1:
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
    manager: EntityManager,
    processId: string,
    type: CatalogueDto,
    user: UserEntity,
  ) {
    const inspectionRepository = manager.getRepository(InspectionEntity);
    const catalogueRepository = manager.getRepository(CatalogueEntity);

    const state = await catalogueRepository.findOne({
      where: {
        code: CatalogueInspectionsStateEnum.autogenerated_1,
        type: CatalogueTypeEnum.inspections_state,
      },
    });

    let inspectionAt = new Date();

    switch (type.code) {
      case CatalogueProcessesTypeEnum.registration:
        inspectionAt = addDays(inspectionAt, 84);
        break;

      case CatalogueProcessesTypeEnum.update:
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
        throw new BadRequestException(`Tipo de trámite no encontrado ${type.name}`);
    }

    let inspection = await inspectionRepository.findOne({
      where: { processId },
    });

    if (!inspection) {
      inspection = inspectionRepository.create();
    }

    inspection.processId = processId;
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

  async saveRegulation(
    manager: EntityManager,
    processId: string,
    regulationResponses: CreateRegulationResponseDto[],
  ) {
    const regulationResponseRepository = manager.getRepository(RegulationResponseEntity);

    // console.log(regulationResponses);
    const data = regulationResponses.map((x) => {
      return {
        processId,
        regulationItemId: x.id,
        isCompliant: x.isCompliant,
        score: x.score,
      };
    });

    console.log(data);
    return regulationResponseRepository.save(data);
  }

  async saveAutoInspection2(manager: EntityManager, processId: string, userId: string) {
    const inspectionRepository = manager.getRepository(InspectionEntity);
    const catalogueRepository = manager.getRepository(CatalogueEntity);

    const state = await catalogueRepository.findOne({
      where: {
        code: CatalogueInspectionsStateEnum.autogenerated_2,
        type: CatalogueTypeEnum.inspections_state,
      },
    });

    let inspection = await inspectionRepository.findOne({
      where: { processId },
    });

    if (!inspection) {
      inspection = inspectionRepository.create();
    }

    await inspectionRepository
      .createQueryBuilder()
      .update(InspectionEntity)
      .set({ isCurrent: false })
      .where('process_id = :processId', { processId })
      .execute();

    inspection.processId = processId;
    inspection.isCurrent = true;
    inspection.observation = 'Fecha auto generada para segunda inspección por el sistema';
    inspection.userId = userId;

    if (state) inspection.stateId = state.id;

    inspection.inspectionAt = set(addDays(new Date(), 42), {
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

  async saveBreachCauses(
    manager: EntityManager,
    processId: string,
    breachCauses: BreachCauseDto[],
  ): Promise<void> {
    const breachCauseRepository = manager.getRepository(BreachCauseEntity);

    for (const item of breachCauses) {
      let breachCause = await breachCauseRepository.findOne({
        where: { processId, code: item.code },
      });

      if (!breachCause) {
        breachCause = breachCauseRepository.create();
      }

      breachCause.processId = processId;
      breachCause.code = item.code;
      breachCause.name = item.name;

      await breachCauseRepository.save(breachCause);
    }
  }

  async saveInactivationCauses(
    manager: EntityManager,
    processId: string,
    inactivationCauses: InactivationCauseDto[],
  ): Promise<void> {
    const inactivationCauseRepository = manager.getRepository(InactivationCauseEntity);

    for (const item of inactivationCauses) {
      let inactivationCause = await inactivationCauseRepository.findOne({
        where: { processId, code: item.code },
      });

      if (!inactivationCause) {
        inactivationCause = inactivationCauseRepository.create();
      }

      inactivationCause.processId = processId;
      inactivationCause.code = item.code;
      inactivationCause.name = item.name;

      await inactivationCauseRepository.save(inactivationCause);
    }
  }

  async createFilesInspectionStatus(
    files: Array<Express.Multer.File>,
    modelId: string,
    typeIds: string[],
    user: UserEntity,
  ): Promise<void> {
    await this.fileService.uploadFiles(files, modelId, typeIds, user.id);
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
    let internalUser = await this.internalUserRepository.findOne({
      where: { isAvailable: true, internalDpaUser: { hasProcess: false, dpaId } },
    });

    if (!internalUser) {
      await this.internalDpaUserRepository
        .createQueryBuilder()
        .update(InternalDpaUserEntity)
        .set({ hasProcess: false })
        .where('dpa_id = :dpaId', { dpaId })
        .execute();

      // Reintentar obtener un usuario disponible
      internalUser = await this.internalUserRepository.findOne({
        where: { isAvailable: true, internalDpaUser: { hasProcess: false, dpaId } },
      });
    }

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

  async saveAdventureTourismModalities(
    processId: string,
    modalities: CreateAdventureTourismModalityDto[],
    manager: EntityManager,
  ): Promise<boolean> {
    const modalityRepository = manager.getRepository(AdventureTourismModalityEntity);

    for (const item of modalities) {
      try {
        const modality = modalityRepository.create();
        modality.processId = processId;
        modality.className = item.className;

        modality.typeId = item.type.id;

        await modalityRepository.save(modality);
        console.log('Guardado modalidad:', modality);
      } catch (error: unknown) {
        console.error('Error guardando modalidad:', error, item);
        let errorMessage = 'Error desconocido';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        throw new BadRequestException({
          error: errorMessage,
          message: `Error guardando Modalidad de Turismo Aventura: ${item.className || item.type?.id}`,
        });
      }
    }

    return true;
  }

  async saveTouristGuides(
    processId: string,
    touristGuides: TouristGuideDto[],
    manager: EntityManager,
  ): Promise<boolean> {
    const touristGuideRepository = manager.getRepository(TouristGuideEntity);

    for (const item of touristGuides) {
      try {
        const touristGuide = touristGuideRepository.create();
        touristGuide.processId = processId;
        touristGuide.identification = item.identification;
        touristGuide.name = item.name;
        touristGuide.isGuide = item.isGuide;

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

  async saveTouristTransports(
    processId: string,
    transports: TransportDto[],
    manager: EntityManager,
  ): Promise<boolean> {
    const transportRepository = manager.getRepository(TouristTransportCompanyEntity);

    if (transports != null && transports.length > 0) {
      for (const item of transports) {
        try {
          const transport = transportRepository.create();
          transport.processId = processId;
          transport.legalName = item.legalName;
          transport.ruc = item.ruc;
          transport.authorizationNumber = item.authorizationNumber;
          transport.rucTypeId = item.rucType.id;
          transport.typeId = item.type.id;

          await transportRepository.save(transport);
        } catch (error: unknown) {
          let errorMessage = 'Error desconocido';
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }

          throw new BadRequestException({
            error: errorMessage,
            message: `Error guardando Transporte Turístico: ${item.legalName || item.ruc || item.type.id || item.authorizationNumber || item.rucType.id}`,
          });
        }
      }
    }

    return true;
  }
}
