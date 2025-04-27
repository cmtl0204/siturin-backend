import { Global, Module } from '@nestjs/common';
import { UbicationController } from './ubication.controller';
import { ubicationProvider } from './ubication.provider';
import { CataloguesService } from './ubication.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [UbicationController],
  providers: [ubicationProvider, CataloguesService],
  exports: [ubicationProvider, CataloguesService, CataloguesService],
})
export class UbicationModule {}
