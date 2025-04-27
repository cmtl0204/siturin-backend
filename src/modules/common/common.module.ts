import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { UbicationModule } from '@modules/common/ubication/ubication.module';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule, UbicationModule],
  exports: [CatalogueModule, FileModule, MailModule, UbicationModule],
})
export class CommonModule {}
