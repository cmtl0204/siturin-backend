import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { controllers } from '@modules/core/roles/external/controllers';
import { CadastreService } from '@modules/core/roles/external/services/cadastre.service';
import { coreProviders } from '@modules/core/core.provider';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule],
  controllers,
  providers: [...coreProviders, CadastreService],
  exports: [],
})
export class ExternalModule {}
