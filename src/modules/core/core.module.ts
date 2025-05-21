import { Global, Module } from '@nestjs/common';
import { DacModule } from '@modules/core/dac/dac.module';
import { coreProviders } from '@modules/core/core.provider';

@Global()
@Module({
  imports: [DacModule],
  providers: [...coreProviders],
})
export class CoreModule {}
