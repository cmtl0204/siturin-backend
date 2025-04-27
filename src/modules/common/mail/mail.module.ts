import { Global, Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { FilesController } from '@modules/common/file/files.controller';
import { FolderPathsService } from '@modules/common/mail/folder-paths.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from '@config';
import { ConfigType } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        transport: {
          host: configService.mail.host,
          port: configService.mail.port,
          secure: false,
          auth: {
            user: configService.mail.user,
            pass: configService.mail.pass,
          },
        },
        defaults: {
          from: configService.mail.from,
        },
        template: {
          dir: join(process.cwd(), 'src/modules/common/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            static: true,
          },
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [MailService, FolderPathsService],
  exports: [MailService, FolderPathsService],
})
export class MailModule {}
