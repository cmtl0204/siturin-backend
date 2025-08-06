import { UserEntity } from '@auth/entities';
import { EmailService } from '@modules/core/shared-core/services/email.service';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CatalogueActivitiesCodeEnum,
  CatalogueCadastresStateEnum,
  CatalogueTypeEnum,
  ConfigEnum,
} from '@utils/enums';
import { ResponseHttpInterface } from '@utils/interfaces';
import { DataSource, EntityManager } from 'typeorm';
import { CreateRegistrationProcessCtcDto } from '@modules/core/roles/external/dto/process-ctc/create-registration-process-ctc.dto';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import {
  AdventureTourismModalityEntity,
  CadastreEntity,
  CadastreStateEntity,
  ProcessCtcEntity,
  ProcessEntity,
  TouristGuideEntity,
  TouristTransportCompanyEntity,
} from '@modules/core/entities';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { addDays, set } from 'date-fns';

@Injectable()
export class ProcessCtcService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
    private readonly processService: ProcessService,
  ) {}

  async createRegistration(
    payload: CreateRegistrationProcessCtcDto,
    user: UserEntity,
  ): Promise<ResponseHttpInterface> {
    return await this.dataSource.transaction(async (manager) => {
      const process = await this.saveProcess(payload, manager);

      await this.saveProcessCtc(payload, manager);

      await this.saveTouristGuides(payload, manager);

      await this.saveAccommodation(payload, manager);

      await this.saveFood(payload, manager);

      // await this.saveCommunityOperation(payload, manager);

      await this.saveTransport(payload, manager);

      // await this.processService.saveAutoInspection(manager, payload, user);// todo: el payload que recibe es de process agency y tengo de mi actividad: ctc

      await this.processService.saveAutoAssignment(
        payload.processId,
        process.establishmentAddress.provinceId,
        manager,
      );

      const cadastre = await this.saveCadastre(payload.processId, manager);

      const responseSendEmail = await this.emailService.sendRegistrationCertificateEmail(cadastre);

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
    payload: CreateRegistrationProcessCtcDto,
    manager: EntityManager,
  ): Promise<ProcessEntity> {
    const processRepository = manager.getRepository(ProcessEntity);
    const catalogueRepository = manager.getRepository(CatalogueEntity);

    const process = await processRepository.findOne({
      where: { id: payload.processId },
      relations: { establishmentAddress: true },
    });

    if (!process) {
      throw new NotFoundException('Trámite no encontrado');
    }

    // review agregar enum para code y type
    const state = await catalogueRepository.findOneBy({
      code: 'pendiente_inspeccion_1',
      type: 'tramite_estados',
    });

    if (state) process.stateId = state.id;

    process.activityId = payload.activity.id;
    process.classificationId = payload.classification.id;
    process.categoryId = payload.category.id;
    process.registeredAt = new Date();
    process.endedAt = new Date();
    process.inspectionExpirationAt = set(addDays(new Date(), 114), {
      hours: 23,
      minutes: 23,
      seconds: 59,
      milliseconds: 0,
    });

    return await processRepository.save(process);
  }

  private async saveProcessCtc(
    payload: CreateRegistrationProcessCtcDto,
    manager: EntityManager,
  ): Promise<ProcessCtcEntity> {
    const processCtcRepository = manager.getRepository(ProcessCtcEntity);
    let processCtc = await processCtcRepository.findOneBy({ processId: payload.processId });

    if (!processCtc) {
      processCtc = processCtcRepository.create();
    }

    processCtc.processId = payload.processId;
    processCtc.hasPropertyRegistrationCertificate = payload.hasPropertyRegistrationCertificate;
    processCtc.hasTechnicalReport = payload.hasTechnicalReport;
    processCtc.hasStatute = payload.hasStatute;

    return await processCtcRepository.save(processCtc);
  }

  private async saveAccommodation(
    payload: CreateRegistrationProcessCtcDto,
    manager: EntityManager,
  ): Promise<ProcessCtcEntity> {
    const processCtcRepository = manager.getRepository(ProcessCtcEntity);
    let processCtc = await processCtcRepository.findOneBy({ processId: payload.processId });

    if (!processCtc) {
      processCtc = processCtcRepository.create();
    }

    processCtc.processId = payload.processId;
    processCtc.totalBeds = payload.accommodation.totalBeds;
    processCtc.totalPlaces = payload.accommodation.totalPlaces;
    processCtc.totalRooms = payload.accommodation.totalRooms;

    return await processCtcRepository.save(processCtc);
  }

  private async saveFood(
    payload: CreateRegistrationProcessCtcDto,
    manager: EntityManager,
  ): Promise<ProcessCtcEntity> {
    const processCtcRepository = manager.getRepository(ProcessCtcEntity);
    let processCtc = await processCtcRepository.findOneBy({ processId: payload.processId });

    if (!processCtc) {
      processCtc = processCtcRepository.create();
    }

    processCtc.processId = payload.processId;
    processCtc.totalCapacities = payload.totalCapacities;
    processCtc.totalTables = payload.totalTables;

    return await processCtcRepository.save(processCtc);
  }

  // private async saveCommunityOperation(
  //   payload: CreateRegistrationProcessCtcDto,
  //   manager: EntityManager,
  // ): Promise<boolean> {
  //   const adventureTourismModalityRepository = manager.getRepository(AdventureTourismModalityEntity);

  //   for (const modality of payload.waters) {
  //     try {
  //       const adventureTourism = adventureTourismModalityRepository.create();
  //       adventureTourism.processId = payload.processId;
  //       adventureTourism.typeId = modality.id

  //       await adventureTourismModalityRepository.save(adventureTourism);
  //     } catch (error: unknown) {
  //       let errorMessage = 'Error desconocido';

  //       if (error instanceof Error) {
  //         errorMessage = error.message;
  //       } else if (typeof error === 'string') {
  //         errorMessage = error;
  //       }

  //       throw new BadRequestException({
  //         error: errorMessage,
  //         message: `Error guardando modalidades`,
  //       });
  //     }
  //   }

  //   for (const modality of payload.lands) {
  //     try {
  //       const adventureTourism = adventureTourismModalityRepository.create();
  //       adventureTourism.processId = payload.processId;
  //       adventureTourism.typeId = modality.id

  //       await adventureTourismModalityRepository.save(adventureTourism);
  //     } catch (error: unknown) {
  //       let errorMessage = 'Error desconocido';

  //       if (error instanceof Error) {
  //         errorMessage = error.message;
  //       } else if (typeof error === 'string') {
  //         errorMessage = error;
  //       }

  //       throw new BadRequestException({
  //         error: errorMessage,
  //         message: `Error guardando modalidades`,
  //       });
  //     }
  //   }

  //   for (const modality of payload.airs) {
  //     try {
  //       const adventureTourism = adventureTourismModalityRepository.create();
  //       adventureTourism.processId = payload.processId;
  //       adventureTourism.typeId = modality.id

  //       await adventureTourismModalityRepository.save(adventureTourism);
  //     } catch (error: unknown) {
  //       let errorMessage = 'Error desconocido';

  //       if (error instanceof Error) {
  //         errorMessage = error.message;
  //       } else if (typeof error === 'string') {
  //         errorMessage = error;
  //       }

  //       throw new BadRequestException({
  //         error: errorMessage,
  //         message: `Error guardando modalidades`,
  //       });
  //     }
  //   }

  //   return true;
  // }

  private async saveTransport(
    payload: CreateRegistrationProcessCtcDto,
    manager: EntityManager,
  ): Promise<boolean> {
    const touristTransportCompanyRepository = manager.getRepository(TouristTransportCompanyEntity);
    const catalogueRepository = manager.getRepository(CatalogueEntity);

    const catalogues = await catalogueRepository.find(); //todo: Una sola consulta a la base de datos y luego usamos ese array

    // Eliminar transportes existentes
    /* await transportRepository.delete({ processId: payload.processId }); */ //todo: Posible reutilizacion en otros tramites

    // Si no hay datos de transporte, retornar
    //if (!payload.transport.hasTransports || payload.transport.touristTransportCompanies.length === 0 ) {
    //return true;
    //}
    if (payload.transport.hasTransports) {
      for (const item of payload.transport.touristTransportCompanies) {
        try {
          const transport = touristTransportCompanyRepository.create();
          const rucType = catalogues.find((x) => (x.code = item.rucType.code));
          // Asignar directamente los campos que vienen del DTO/Entidad
          transport.processId = payload.processId;
          transport.ruc = item.ruc;
          transport.legalName = item.legalName;
          transport.authorizationNumber = item.authorizationNumber;

          // Si vienen los IDs de las relaciones, asignarlas directamente

          transport.typeId = item.type.id;

          if (rucType) {
            transport.rucTypeId = rucType.id;
          }

          await touristTransportCompanyRepository.save(transport);
        } catch (error: unknown) {
          let errorMessage = 'Error desconocido';

          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }

          throw new BadRequestException({
            error: errorMessage,
            message: `Error guardando Compañía de Transporte: ${item.legalName || item.ruc}`,
          });
        }
      }
    }

    return true;
  }

  private async saveTouristGuides(
    payload: CreateRegistrationProcessCtcDto,
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
        code: CatalogueCadastresStateEnum.pending,
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
}
