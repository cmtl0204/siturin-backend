import { Global, Module } from '@nestjs/common';
import { controllers } from '@modules/core/shared-core/controllers';
import { TouristGuideService } from '@modules/core/shared-core/services/tourist-guide.service';
import { coreProviders } from '@modules/core/core.provider';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import { CadastreService } from '@modules/core/shared-core/services/cadastre.service';
import { EmailService } from '@modules/core/shared-core/services/email.service';
import { ActivityService } from '@modules/core/shared-core/services/activity.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers,
  providers: [
    ...coreProviders,
    ActivityService,
    EmailService,
    TouristGuideService,
    ProcessService,
    CadastreService,
  ],
  exports: [ProcessService, EmailService],
})
export class SharedCoreModule {}
