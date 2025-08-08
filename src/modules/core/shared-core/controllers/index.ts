import { TouristGuideController } from './tourist-guide.controller';
import { ProcessesController } from './process.controller';
import { CadastreController } from '@modules/core/shared-core/controllers/cadastre.controller';
import { ActivityController } from '@modules/core/shared-core/controllers/activity.controller';
import { RegulationSectionController } from '@modules/core/shared-core/controllers/regulation-section.controller';

export const controllers = [
  ActivityController,
  TouristGuideController,
  ProcessesController,
  CadastreController,
  RegulationSectionController,
];
