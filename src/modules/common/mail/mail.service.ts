// src/modules/common/mail/mail.service.ts
import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { config } from '@config';
import { MailDataInterface } from './interfaces/mail-data.interface';
import { join } from 'path';
import { FolderPathsService } from './folder-paths.service';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly folderPathsService: FolderPathsService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.mail.host,
      port: this.configService.mail.port,
      secure: false,
      auth: {
        user: this.configService.mail.user,
        pass: this.configService.mail.pass,
      },
    });
  }

  async sendMail(mailData: MailDataInterface) {
    const mailAttachments: any[] = [];

    // Archivos adjuntos
    const handleAttachment = (attachment: any) => {
      if (attachment?.file) {
        mailAttachments.push({
          content: attachment.file,
          filename: attachment.filename,
          contentDisposition: 'attachment',
        });
      } else if (attachment?.path) {
        mailAttachments.push({
          path: join(this.folderPathsService.mailTemporaryFiles, attachment.path),
          filename: attachment.filename,
          contentDisposition: 'attachment',
        });
      }
    };

    mailData.attachments?.forEach(handleAttachment);
    if (mailData.attachment) handleAttachment(mailData.attachment);

    // Imagenes embebidas
    mailAttachments.push(
      {
        filename: 'header.png',
        path: join(this.folderPathsService.mailImages, 'header.png'),
        cid: 'header',
      },
      {
        filename: 'footer.png',
        path: join(this.folderPathsService.mailImages, 'footer.png'),
        cid: 'footer',
      },
    );

    // Cargar y compilar plantilla (Handlebars)
    let html = '';
    try {
      const templatePath = join(
        this.folderPathsService.mailTemplates,
        `${mailData.template}.hbs`,
      );
      const source = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(source);
      html = compiledTemplate({
        system: 'environments.appName',
        data: mailData.data,
      });
    } catch (err) {
      console.error('Error cargando plantilla:', err);
      return { error: true, message: 'No se pudo procesar la plantilla' };
    }

    const sendOptions: nodemailer.SendMailOptions = {
      to: mailData.to,
      from: `"${this.configService.mail.fromName}" <${this.configService.mail.from}>`,
      subject: mailData.subject,
      html,
      attachments: mailAttachments,
    };

    try {
      const response = await this.transporter.sendMail(sendOptions);
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
