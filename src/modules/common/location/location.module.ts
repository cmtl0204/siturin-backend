import { Global, Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { locationProvider } from './location.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { LocationService } from '@modules/common/location/location.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [LocationController],
  providers: [locationProvider, LocationService],
  exports: [locationProvider, LocationService],
})
export class LocationModule {}
