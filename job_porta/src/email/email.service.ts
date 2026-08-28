import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from 'src/email/dto/email.dto';
// import { env } from 'process';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

//   emailTransport() {
//     const transporter = nodemailer.createTransport({
//       host: this.configService.get<string>('EMAIL_HOST'),
//       port: this.configService.get<number>('PORT'),
//       secure: false,
//       auth: {
//         user: this.configService.get<string>('EMAIL_USER'),
//         pass: this.configService.get<string>('EMAIL_PASSWORD'),
//       },
//     });

//     return transporter;
//   }

  emailTransport() {
    console.log('Mail Host:', this.configService.get<string>('MAIL_HOST')); // Log the environment variable values
    console.log('Mail Port:', this.configService.get<number>('MAIL_PORT'));
    console.log('Email User:', this.configService.get<string>('EMAIL_USER'));
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),  // Use 'MAIL_HOST'
      port: this.configService.get<number>('MAIL_PORT'),  // Use 'MAIL_PORT'
      secure: false, // keep 'false' for port 587 (TLS)
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    return transporter;
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html } = dto;

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipients,
      subject: subject,
      html: html,
    };

    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending mail: ', error);
      throw new Error('Email sending failed');
    }
  }

//   async sendEmail(dto: sendEmailDto) {
//     const { recipients, subject, html } = dto;

//     const transport = this.emailTransport();

//     const options: nodemailer.SendMailOptions = {
//       from: this.configService.get<string>('EMAIL_USER'),
//       to: recipients,
//       subject: subject,
//       html: html,
//     };
//     try {
//       await transport.sendMail(options);
//       console.log('Email sent successfully');
//     } catch (error) {
//       console.log('Error sending mail: ', error);
//     }
//   }
}