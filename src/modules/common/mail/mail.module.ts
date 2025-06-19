import { Global, Module } from '@nestjs/common';
import { FileController } from '@modules/common/file/file.controller';
import { FolderPathsService } from '@modules/common/mail/folder-paths.service';
import { MailService } from './mail.service';
import { config } from '@config';
import { ConfigType } from '@nestjs/config';

@Global()
@Module({
  imports: [],
  controllers: [FileController],
  providers: [
    MailService,
    FolderPathsService,
    {
      provide: 'MAIL_CONFIG',
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        host: configService.mail.host,
        port: configService.mail.port,
        secure: false,
        auth: {
          user: configService.mail.user,
          pass: configService.mail.pass,
        },
        from: configService.mail.from,
      }),
    },
  ],
  exports: [MailService, FolderPathsService],
})
export class MailModule {}
