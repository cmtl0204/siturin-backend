import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { controllers } from '@modules/core/roles/external/controllers';
import { CadastreService } from '@modules/core/roles/external/services/cadastre.service';
import { coreProviders } from '@modules/core/core.provider';
import { ProcessAgencyService } from '@modules/core/roles/external/services/process-agency.service';
import { SharedCoreModule } from '@modules/core/shared-core/shared-core.module';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule, SharedCoreModule],
  controllers,
  providers: [...coreProviders, CadastreService, ProcessAgencyService],
  exports: [],
})
export class ExternalModule {}
