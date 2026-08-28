// dto/reset-password.dto.ts
import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  @IsNotEmpty({ message: 'Password is required' })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  confirmPassword: string;
}
