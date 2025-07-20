import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum, CoreRepositoryEnum, MailTemplateEnum } from '@utils/enums';
import { CadastreEntity, ProcessEntity } from '@modules/core/entities';
import { UserEntity } from '@auth/entities';
import { MailService } from '@modules/common/mail/mail.service';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { InternalPdfService } from '@modules/reports/pdf/internal-pdf.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailService,
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly processRepository: Repository<ProcessEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    private readonly internalPdfService: InternalPdfService,
  ) {}

  async sendRegistrationCertificateEmail(cadastre: CadastreEntity) {
    const process = await this.processRepository.findOne({
      where: { id: cadastre.processId },
      relations: {
        establishment: { ruc: true },
        establishmentAddress: true,
        establishmentContactPerson: true,
      },
    });

    const user = await this.userRepository.findOneBy({
      identification: process?.establishment.ruc.number,
    });

    if (!process) {
      throw new NotFoundException('Trámite no encontrado');
    }

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const data = {
      ruc: process?.establishment.ruc.number,
      registerNumber: cadastre.registerNumber,
    };

    const failedRecipients: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const recipients = [user.email, process.establishmentContactPerson.email].filter((email) => {
      if (emailRegex.test(email)) {
        return true;
      }

      failedRecipients.push(email);
      return false;
    });

    if (recipients.length === 0) {
      return {
        title: 'No se pudo entregar a ningun correo',
        message: failedRecipients,
      };
    }

    if (recipients.length === 0) {
      return {
        title: 'No se pudo entregar a a los siguientes correos',
        message: failedRecipients,
      };
    }

    const pdf = await this.internalPdfService.generateUsersReportBuffer();

    const mailData: MailDataInterface = {
      to: recipients,
      data,
      subject: `Registro de Turismo ${cadastre.registerNumber}`,
      template: MailTemplateEnum.INTERNAL_REGISTRATION_CERTIFICATE,
      attachments: [{ file: pdf, filename: `${cadastre.registerNumber}.pdf` }],
    };

    await this.mailService.sendMail(mailData);
  }
}
