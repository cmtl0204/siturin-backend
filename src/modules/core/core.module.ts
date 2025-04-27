import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { controllers } from '@modules/core/entities';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule],
  controllers,
  exports: [CatalogueModule, FileModule, MailModule],
})
export class CoreModule {}
