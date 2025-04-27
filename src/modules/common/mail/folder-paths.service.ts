import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FolderPathsService {
  constructor() {}

  get mailTemporaryFiles(): string {
    return join(process.cwd(), 'src/modules/common/mail/temporary-files');
  }

  get mailImages(): string {
    return join(process.cwd(), 'src/modules/common/mail/images');
  }

  get mailTemplates(): string {
    return join(process.cwd(), 'src/modules/common/mail/templates');
  }
}
