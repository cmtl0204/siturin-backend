import { Global, Module } from '@nestjs/common';
import { controllers } from '@modules/core/shared-core/controllers';
import { TouristGuideService } from '@modules/core/shared-core/services/tourist-guide.service';
import { coreProviders } from '@modules/core/core.provider';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import { CadastreService } from '@modules/core/shared-core/services/cadastre.service';

@Global()
@Module({
  imports: [],
  controllers,
  providers: [...coreProviders, TouristGuideService, ProcessService, CadastreService],
  exports: [ProcessService],
})
export class SharedCoreModule {}
