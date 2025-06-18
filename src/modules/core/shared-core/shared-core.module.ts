import { Global, Module } from '@nestjs/common';
import { controllers } from '@modules/core/shared-core/controllers';
import { TouristGuideService } from '@modules/core/shared-core/services/tourist-guide.service';
import { coreProviders } from '@modules/core/core.provider';

@Global()
@Module({
  imports: [],
  controllers,
  providers: [...coreProviders, TouristGuideService],
  exports: [],
})
export class SharedCoreModule {}
