import { Global, Module } from '@nestjs/common';
import { DpaController } from './dpa.controller';
import { dpaProvider } from './dpa.provider';
import { CataloguesService } from './dpa.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [DpaController],
  providers: [dpaProvider, CataloguesService],
  exports: [dpaProvider, CataloguesService, CataloguesService],
})
export class DpaModule {}
