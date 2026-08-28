// import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
// import { Role } from '../entities/user.entity';

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   username: string;

//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   password: string;

//   @IsEnum(Role)
//   @IsNotEmpty()
//   role: Role;
// }



import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @Matches(/^[A-Za-z\s'-]+$/, {
    message: 'First name must contain only letters, spaces, apostrophes, or hyphens',
  })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @Matches(/^[A-Za-z\s'-]+$/, {
    message: 'Last name must contain only letters, spaces, apostrophes, or hyphens',
  })
  last_name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsEnum(Role, { message: 'Role must be one of the defined enum values' })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;
}

