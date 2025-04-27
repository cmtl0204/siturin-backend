import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigType } from '@nestjs/config';
import { config } from '@config';
import { MailDataInterface } from './interfaces/mail-data.interface';
import { join } from 'path';
import { FolderPathsService } from './folder-paths.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly folderPathsService: FolderPathsService,
  ) {}

  async sendMail(mailData: MailDataInterface) {
    const mailAttachments: {
      content?: Buffer;
      filename: string;
      contentDisposition?: string;
      cid?: string;
    }[] = [];

    if (mailData?.attachments) {
      mailData.attachments.forEach((attachment) => {
        let data!: {
          content?: Buffer;
          filename: string;
          contentDisposition: string;
          path?: string;
        };

        if (attachment.file) {
          data = {
            content: attachment.file,
            filename: attachment.filename,
            contentDisposition: 'attachment',
          };

          mailAttachments.push(data);
        }

        if (attachment.path) {
          data = {
            path: join(
              this.folderPathsService.mailTemporaryFiles,
              attachment.path,
            ),
            filename: attachment.filename,
            contentDisposition: 'attachment',
          };

          mailAttachments.push(data);
        }
      });
    }

    if (mailData?.attachment) {
      let data!: {
        content?: Buffer;
        filename: string;
        contentDisposition: string;
        path?: string;
      };

      if (mailData.attachment.file) {
        data = {
          content: mailData.attachment.file,
          filename: mailData.attachment.filename,
          contentDisposition: 'attachment',
        };

        mailAttachments.push(data);
      }

      if (mailData.attachment.path) {
        data = {
          path: join(
            this.folderPathsService.mailTemporaryFiles,
            mailData.attachment.path,
          ),
          filename: mailData.attachment.filename,
          contentDisposition: 'attachment',
        };
        mailAttachments.push(data);
      }
    }

    const header = {
      filename: 'header.png',
      path: join(this.folderPathsService.mailImages, 'header.png'),
      cid: 'header',
    };

    const footer = {
      filename: 'footer.png',
      path: join(this.folderPathsService.mailImages, 'footer.png'),
      cid: 'footer',
    };

    mailAttachments.push(header);
    mailAttachments.push(footer);

    const sendMailOptions = {
      to: mailData.to,
      from: `${this.configService.mail.fromName} ${this.configService.mail.from}`,
      subject: mailData.subject,
      template: mailData.template,
      context: { system: 'environments.appName', data: mailData.data },
      attachments: mailAttachments,
    };

    try {
      const response = await this.mailerService.sendMail(sendMailOptions);

      return {
        accepted: response.accepted,
        rejected: response.rejected,
      };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return {
        error: true,
        message: error.message || 'No se pudo enviar el correo',
      };
    }
  }
}
