import { Global, Module } from '@nestjs/common';
import { DacModule } from '@modules/core/dac/dac.module';
import { coreProviders } from '@modules/core/core.provider';
import { SharedCoreModule } from '@modules/core/shared-core/shared-core.module';

@Global()
@Module({
  imports: [SharedCoreModule, DacModule],
  providers: [...coreProviders],
})
export class CoreModule {}
