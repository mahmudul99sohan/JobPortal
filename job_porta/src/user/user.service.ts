



import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not , DataSource} from 'typeorm';
import { User, Role } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OTPType } from 'src/otp/type/otpType';
import { OTPService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly otpService: OTPService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  private readonly roleMetadata = {
    super_admin: { prefix: '10', suffix: '9' },
    admin: { prefix: '20', suffix: '8' },
    employer: { prefix: '30', suffix: '7' },
    job_seeker: { prefix: '40', suffix: '6' },
  };


private async generateCustomUserId(role: Role): Promise<string> {
  const meta = this.roleMetadata[role];

  if (!meta) {
    throw new Error(`Invalid role: ${role}`);
  }

  const result = await this.dataSource.transaction(async (manager) => {
    // Ensure the role row exists first
    await manager
      .createQueryBuilder()
      .insert()
      .into('user_role_counters')
      .values({ role, counter: 0 })
      .orIgnore()
      .execute();

    // Increment the counter
    await manager
      .createQueryBuilder()
      .update('user_role_counters')
      .set({ counter: () => 'counter + 1' })
      .where('role = :role', { role })
      .execute();

    // Retrieve the updated counter
    const updated = await manager
      .createQueryBuilder()
      .select('counter')
      .from('user_role_counters', 'urc')
      .where('role = :role', { role })
      .getRawOne();

    if (!updated || updated.counter === undefined) {
      throw new Error(`Failed to retrieve updated counter for role: ${role}`);
    }

    return updated.counter;
  });

  const middle = result.toString().padStart(5, '0');
  return `${meta.prefix}-${middle}-${meta.suffix}`;
}


async testCounterUpdate(role: string) {
  const update = await this.dataSource
    .createQueryBuilder()
    .update('user_role_counters')
    .set({ counter: () => 'counter + 1' })
    .where('role = :role', { role })
    .returning(['*'])
    .execute();

  console.log('Update result:', update);
  return update;
}


  async create(createUserDto: CreateUserDto, currentUser: User): Promise<Partial<User>> {
  // if (
  //   createUserDto.role === Role.SUPER_ADMIN &&
  //   currentUser.role !== Role.SUPER_ADMIN
  // ) {
  //   throw new ForbiddenException('Only Super-Admins can create Super-Admins');
  // }

  const exist_user_email = await this.userRepository.findOne({
    where: { email: createUserDto.email },
  });

  if (exist_user_email) {
    throw new BadRequestException({ message: 'Email already exists' });
  }

  const full_name = `${createUserDto.first_name} ${createUserDto.last_name}`;
  const password = await bcrypt.hash(createUserDto.password, 10);
  const username = await this.generateCustomUserId(createUserDto.role);
  
  const user = this.userRepository.create({
    ...createUserDto,
    full_name,
    username, // role-based ID as username
    password,
  });

  const savedUser = await this.userRepository.save(user);

  // Send OTP via email after saving the user
  await this.emailVerification(savedUser, OTPType.OTP);

  // Return the user (excluding sensitive fields like password)
  const { password: userPassword, ...result } = savedUser;
  return result;
}


  //send otp or reset link via email
  async emailVerification(user: User, otpType: OTPType) {
    const token = await this.otpService.generateToken(user, otpType);
    // if (otpType === OTPType.OTP) {
    //   const emailDto = {
    //     recipients: [user.email],
    //     subject: 'OTP for verification',
    //     html: `
    //       <p>Hello, ${user.full_name}</p>
    //       <p>Your account verification is almost complete. Please use the following details to verify your account:</p>
    //       <ul>
    //         <li><strong>Email:</strong> ${user.email}</li>
    //         <li><strong>OTP:</strong> <strong>${token}</strong></li>
    //       </ul>
    //       <p>Use the OTP <strong>${token}</strong> to verify your account.</p>
    //       <p>If you did not request verification, please ignore this email.</p>
    //       <p>Click the following link to log in and complete the verification: <a href="http://localhost:3000/auth/login">Login</a></p>
    //     `,
    //   };

    //   // Send OTP via email
    //   return await this.emailService.sendEmail(emailDto);
    // }
    if (otpType === OTPType.OTP) {
    const emailDto = {
      recipients: [user.email],
      subject: 'OTP for verification',
      html: `
        <p>Hello, ${user.full_name}</p>
        <p>Your account verification is almost complete. Please use the following details to verify your account:</p>
        <ul>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>OTP:</strong> <strong>${token}</strong></li>
          <li><strong>Password:</strong> <strong>${user.password}</strong></li>
        </ul>
        <p>Use the OTP <strong>${token}</strong> to verify your account.</p>
        <p>If you did not request verification, please ignore this email.</p>
        <p>Click the following link to log in and complete the verification: <a href="http://localhost:3000/auth/login">Login</a></p>
      `,
    };

    return await this.emailService.sendEmail(emailDto);
  }



    else if (otpType === OTPType.RESET_LINK) {
      const resetLink = `${this.configService.get('RESET_PASSWORD_URL')}?token=${token}`;

      const emailDto = {
        recipients: [user.email],
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Hello ${user.full_name || 'User'},</h2>
            <p>You recently requested to reset your password. Click the button below to proceed:</p>
            <p style="margin: 24px 0;">
              <a href="${resetLink}" style="
                background-color: #007BFF;
                color: #fff;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
              ">
                Reset Your Password
              </a>
            </p>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <hr style="margin: 32px 0;" />
            <p style="font-size: 0.9em; color: #666;">
              If you did not request a password reset, no further action is required — your account is still secure.
            </p>
            <p style="font-size: 0.9em; color: #666;">
              This reset link will expire in 10 minutes for your security.
            </p>
          </div>
        `,
      };


      //send reset link via email
      return await this.emailService.sendEmail(emailDto);
    }
  }

  async findAll(currentUser: User): Promise<Partial<User>[]> {
    const users =
      currentUser.role === Role.SUPER_ADMIN
        ? await this.userRepository.find()
        : await this.userRepository.find({ where: { role: Not(Role.SUPER_ADMIN) } });

    return users.map(({ password, ...rest }) => rest);
  }



// src/user/user.service.ts

async updateBanStatus(id: number, isBanned: boolean) {
  const user = await this.userRepository.findOneBy({ id });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.is_banned = isBanned;
  return this.userRepository.save(user);
}




  // async findOne(id: number, currentUser: User): Promise<Partial<User>> {
  //   const user = await this.userRepository.findOneBy({ id });
  //   if (!user) throw new NotFoundException('User not found');

  //   if (user.role === Role.SUPER_ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
  //     throw new ForbiddenException('Cannot access Super-Admin');
  //   }

  //   const { password, ...rest } = user;
  //   return rest;
  // }

  // async update(id: number, updateUserDto: UpdateUserDto, currentUser: User): Promise<Partial<User>> {
  //   const user = await this.findOne(id, currentUser);

  //   if (user.role === Role.SUPER_ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
  //     throw new ForbiddenException('Cannot update Super-Admin');
  //   }

  //   if ('password' in updateUserDto && updateUserDto.password) {
  //     const salt = await bcrypt.genSalt();
  //     updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
  //   }

  //   const toUpdate = await this.userRepository.preload({
  //     id,
  //     ...updateUserDto,
  //   });

  //   if (!toUpdate) throw new NotFoundException('User not found for update');

  //   const updated = await this.userRepository.save(toUpdate);
  //   const { password, ...rest } = updated;
  //   return rest;
  // }

  // async remove(id: number, currentUser: User): Promise<void> {
  //   const user = await this.userRepository.findOneBy({ id });
  //   if (!user) throw new NotFoundException('User not found');

  //   if (user.role === Role.SUPER_ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
  //     throw new ForbiddenException('Cannot delete Super-Admin');
  //   }

  //   await this.userRepository.remove(user);
  // }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  
}
