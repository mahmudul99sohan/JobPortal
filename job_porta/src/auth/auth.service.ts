

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { loginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { OTPService } from 'src/otp/otp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpService: OTPService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(email: string, password: string) {
  //   const user = await this.userService.findByEmail(email);
  //   if (!user) throw new UnauthorizedException('Invalid credentials');

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  //   return user;
  // }

  // async login(loginDto: LoginDto) {
  //   const user = await this.validateUser(loginDto.email, loginDto.password);

  //   const payload = { sub: user.id, role: user.role };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

async login(dto: loginDto) {
  try {
    const { identifier, password, otp } = dto;

    const user =
      (await this.userRepository.findOne({ where: { username: identifier } })) ||
      (await this.userRepository.findOne({ where: { email: identifier } }));

    if (!user) {
      throw new UnauthorizedException('Invalid username or email');
    }

    if (user.is_banned) {
      throw new UnauthorizedException('Your account has been banned.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect password. Please try again.');
    }

    if (!user.is_email_verified) {
      if (!otp) {
        return {
          message: 'Your account is not verified. Please provide your OTP to verify.',
        };
      } else {
        await this.verifyToken(user.id, otp);
      }
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.id,
      email: user.email,
    };
  } catch (err) {
    if (
      err instanceof UnauthorizedException ||
      err instanceof BadRequestException
    ) {
      throw err;
    }
    throw new BadRequestException('Login failed');
  }
}



async verifyToken(userId: Number, token: string) {
    await this.otpService.validateOTP(userId, token);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //if otp is valid, account is verified
    user.is_email_verified = true;
    return await this.userRepository.save(user);
  }



   //service for reset password
  // async resetPassword(token: string, newPassword: string): Promise<string> {
  //   const userId = await this.otpService.validateResetPassword(token);

  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }

  //   //hash the new password and update the user
  //   user.password = await bcrypt.hash(newPassword, 10);
  //   await this.userRepository.save(user);

  //   return 'Password reset successfully';
  // }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {

  const { token, newPassword, confirmPassword } = dto;

  if (newPassword !== confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  const userId = await this.otpService.validateResetPassword(token);
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await this.userRepository.save(user);

  return { message: 'Password reset successfully' };

}

  
}
