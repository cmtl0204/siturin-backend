import { ProcessTransportController } from './process-transport.controller';
import { CadastreController } from './cadastre.controller';
import { ProcessAgencyController } from '@modules/core/roles/external/controllers/process-agency.controller';
import { EstablishmentController } from '@modules/core/roles/external/controllers/establishment.controller';

export const controllers = [
  CadastreController,
  EstablishmentController,
  ProcessAgencyController,
  ProcessTransportController,
];
