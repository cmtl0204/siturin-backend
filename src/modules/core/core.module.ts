import { Global, Module } from '@nestjs/common';
import { DacModule } from '@modules/core/dac/dac.module';

@Global()
@Module({
  imports: [DacModule],
})
export class CoreModule {}
