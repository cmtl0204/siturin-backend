import { Global, Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { fileProviders } from './file.providers';

@Global()
@Module({
  controllers: [FilesController],
  providers: [...fileProviders, FilesService],
  exports: [...fileProviders, FilesService],
})
export class FileModule {}
