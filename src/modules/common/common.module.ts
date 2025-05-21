import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { LocationModule } from '@modules/common/location/location.module';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule, LocationModule],
  exports: [CatalogueModule, FileModule, MailModule, LocationModule],
})
export class CommonModule {}
