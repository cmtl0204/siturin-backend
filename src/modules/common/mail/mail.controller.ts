import { Controller, Get } from '@nestjs/common';
import { ResponseHttpInterface } from '@utils/interfaces';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from '@modules/common/mail/mail.service';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { MailTemplateEnum } from '@utils/enums';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Mails')
@Controller('common/mails')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Send Test Email' })
  @PublicRoute()
  @Get('test')
  async test(): Promise<ResponseHttpInterface> {
    const mailData: MailDataInterface = {
      to: 'test@test.com',
      subject: 'Testing Email Send',
      template: MailTemplateEnum.TESTING,
      data: {
        test: 'Testing',
      },
    };

    await this.mailService.sendMail(mailData);

    return {
      data: null,
      message: 'Correo enviado correctamente',
      title: 'Enviado',
    };
  }
}
