

// import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request,Req } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
// import { Request } from 'express';
// import { RolesGuard } from '../auth/roles.guard';
// import { Role,User } from './entities/user.entity';
// import { Roles } from 'src/auth/roles.decorator';


// // import { Role } from './entities/user.entity';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   @UseGuards(RolesGuard)  // Ensures the user is an admin or super-admin
//   async create(@Body() createUserDto: CreateUserDto, @Request() req) {
//     return this.userService.create(createUserDto, req.user);
//   }

//   @Get()
//   @UseGuards(RolesGuard)  // Ensures the user is an admin or super-admin
//   // async findAll() {
//   //   return this.userService.findAll();
//   // }
//   async findAll(@Req() req: Request) {
//     return this.userService.findAll(req.user as User); // ✅ pass logged-in user
//   }

  

//   // @Get(':id')
//   // @UseGuards(RolesGuard)
//   // async findOne(@Param('id') id: number) {
//   //   return this.userService.findOne(id);
//   // }

//   @Get(':id')
// @UseGuards(RolesGuard)
// @Roles(Role.ADMIN, Role.SUPER_ADMIN)
// async findOne(@Param('id') id: number, @Req() req: Request) {
//   const currentUser = req.user as User;
//   return this.userService.findOne(id, currentUser);
// }


//   @Put(':id')
//   @UseGuards(RolesGuard)
//   async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
//     return this.userService.update(id, updateUserDto, req.user);
//   }

//   @Delete(':id')
//   @UseGuards(RolesGuard)
//   async remove(@Param('id') id: number, @Request() req) {
//     return this.userService.remove(id, req.user);
//   }
// }



import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
  Patch,
  ParseIntPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role, User } from './entities/user.entity';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequestTokenDto } from './dto/requestToken.dto';
import { OTPType } from 'src/otp/type/otpType';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('users')
// @UseGuards(AuthGuard('jwt'),RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const currentUser = req.user as any;
    return this.userService.create(createUserDto, currentUser);
  }

   @Post('request-otp')
  async requestOTP(@Body() dto: RequestTokenDto) {
    const { email } = dto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //send otp
    await this.userService.emailVerification(user, OTPType.OTP);
    return { message: 'OTP sent successfully.Please check email' };
  }


  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: RequestTokenDto) {
    const { email } = forgotDto;
    // console.log(`email at forgotPassword controller : ${email}`)
    // console.log('Received data:', forgotDto);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.emailVerification(user, OTPType.RESET_LINK);
    return {
      message: 'Password reset link has been sent.Please check your mail.',
    };
  }

  @Get('test-update/:role')
  async testUpdate(@Param('role') role: string) {
    return this.userService.testCounterUpdate(role);
  }



  // users.controller.ts
  @Patch(':id/ban')
  // @UseGuards(AuthGuard)
  async updateBanStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('is_banned') isBanned: boolean,
  ) {
    return this.userService.updateBanStatus(id, isBanned);
  }



  // @Get()
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // async findAll(@Req() req: Request) {
  //   const currentUser = req.user as any;
  //   return this.userService.findAll(currentUser);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async findAll() {
  //   const currentUser = { role: Role.SUPER_ADMIN } as User;
  //   return this.userService.findAll(currentUser);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles( Role.SUPER_ADMIN, Role.ADMIN)
  async findAll(@Req() req: Request) {
    const currentUser = req.user as User;
    return this.userService.findAll(currentUser);
  }
//


  // @Get(':id')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // async findOne(@Param('id') id: number, @Req() req: Request) {
  //   const currentUser = req.user as any;
  //   return this.userService.findOne(+id, currentUser);
  // }

  // @Put(':id')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @Req() req: Request,
  // ) {
  //   const currentUser = req.user as any;
  //   const updatedUser = await this.userService.update(+id, updateUserDto, currentUser);
  //   return {
  //     message: 'User updated successfully',
  //     user: updatedUser, // optional: include updated user info
  //   };
  // }



  // @Delete(':id')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // async remove(@Param('id') id: number, @Req() req: Request) {
  //   const currentUser = req.user as any;
  //   await this.userService.remove(+id, currentUser);
  //   return { message: 'User deleted successfully' }; 
  // }

  
}
