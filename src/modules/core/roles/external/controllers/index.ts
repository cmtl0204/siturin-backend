import { ProcessTransportController } from './process-transport.controller';
import { CadastreController } from './cadastre.controller';
import { ProcessAgencyController } from '@modules/core/roles/external/controllers/process-agency.controller';

export const controllers = [
  CadastreController,
  ProcessAgencyController,
  ProcessTransportController,
];
