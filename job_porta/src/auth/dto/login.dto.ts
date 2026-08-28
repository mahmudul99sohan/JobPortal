import { IsString, IsOptional } from 'class-validator';
// import { IsEmailOrUsername } from '../../common/validators/is-email-or-username.decorator';
import { IsEmailOrUsername } from 'src/common/validators/is-email-or-username.decorator';

export class loginDto {
  @IsEmailOrUsername({ message: 'Must be a valid email or username' })
  identifier: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  otp?: string;
}
