import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { config } from '@config';
import { MailDataInterface } from './interfaces/mail-data.interface';
import { join } from 'path';
import { FolderPathsService } from '../folder-paths.service';
import { Attachment } from 'nodemailer/lib/mailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly folderPathsService: FolderPathsService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.mail.host,
      port: this.configService.mail.port,
      secure: this.configService.mail.secure == 'true',
      auth: {
        user: this.configService.mail.user,
        pass: this.configService.mail.pass,
      },
    });
  }

  async onModuleInit() {
    //await this.configTemplates();
  }

  private async configTemplates() {
    let pathTemplates = join(__dirname, 'templates');

    if (this.configService.env !== 'production') {
      pathTemplates = this.folderPathsService.mailTemplates;
    }

    const hbs = (await import('nodemailer-express-handlebars')).default;

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: `${this.folderPathsService.mailTemplates}/layouts`,
          partialsDir: `${this.folderPathsService.mailTemplates}/partials`,
          defaultLayout: 'main',
        },
        viewPath: pathTemplates,
        extName: '.hbs',
      }),
    );
  }

  async sendMail(mailData: MailDataInterface) {
    const mailAttachments: Attachment[] = [];

    if (mailData?.attachments) {
      mailData.attachments.forEach((attachment) => {
        let data!: Attachment;

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
            path: join(this.folderPathsService.mailTemporaryFiles, attachment.path),
            filename: attachment.filename,
            contentDisposition: 'attachment',
          };

          mailAttachments.push(data);
        }
      });
    }

    // if (mailData?.attachment) {
    //   let data!: Attachment;
    //
    //   if (mailData.attachment.file) {
    //     data = {
    //       content: mailData.attachment.file,
    //       filename: mailData.attachment.filename,
    //       contentDisposition: 'attachment',
    //     };
    //
    //     mailAttachments.push(data);
    //   }
    //
    //   if (mailData.attachment.path) {
    //     data = {
    //       path: join(this.folderPathsService.mailTemporaryFiles, mailData.attachment.path),
    //       filename: mailData.attachment.filename,
    //       contentDisposition: 'attachment',
    //     };
    //     mailAttachments.push(data);
    //   }
    // }

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
      from: `"${this.configService.mail.fromName}" <${this.configService.mail.from}>`,
      subject: mailData.subject,
      template: mailData.template,
      context: { system: 'SITURIN', data: mailData.data },
      attachments: mailAttachments,
    };

    try {
      const response: SentMessageInfo = await this.transporter.sendMail(sendMailOptions);

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
