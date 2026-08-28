// src/job/job.controller.ts
import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Put,
    Delete,
    Query,
    Req,
    UseGuards,
    ForbiddenException
  } from '@nestjs/common';
  import { JobService } from './job.service';
  import { CreateJobDto } from './dto/create-job.dto';
  import { UpdateJobDto } from './dto/update-job.dto';
  import { Request } from 'express';
  import { Roles } from '../auth/roles.decorator';
  import { Role } from '../user/entities/user.entity';
  import { RolesGuard } from '../auth/roles.guard';
  import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
  
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Controller('jobs')
  export class JobController {
    constructor(private readonly jobService: JobService) {}
  
    // @Post()
    // @Roles(Role.EMPLOYER, Role.ADMIN, Role.SUPER_ADMIN)
    // async create(@Body() dto: CreateJobDto, @Req() req: any) {
    //   const user = req.user; // Get user from request
    //   if (!user) {
    //     throw new ForbiddenException('No user logged in');
    //   }
    //   return this.jobService.create(dto, user);
    // }

    @Post()
    // @Roles(Role.EMPLOYER, Role.ADMIN, Role.SUPER_ADMIN)
    async create(@Body() dto: CreateJobDto, @Req() req: Request) {
      const user = req.user; // Ensure user is being passed correctly from request
      // console.log('User from request:', user); // Check if user data is correctly populated
      return this.jobService.create(dto, user);
    }

  
    // @Get()
    // findAll(@Query('search') search: string) {
    //   return this.jobService.findAll(search);
    // }

    @Get()
    async findAll(@Query('filter') filter?: string) {
      // Log the filter to ensure it's received properly
      // console.log('Filter received in controller:', filter);
      
      // Pass the filter parameter to the service method
      return this.jobService.findAll(filter);
    }
  
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.jobService.findOne(id);
    }
  
    @Put(':id')
    @Roles(Role.EMPLOYER, Role.ADMIN, Role.SUPER_ADMIN)
    update(@Param('id') id: number, @Body() dto: UpdateJobDto) {
      return this.jobService.update(id, dto);
    }
  
    @Delete(':id')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    remove(@Param('id') id: number) {
      return this.jobService.remove(id);
    }
  
    @Post(':id/approve')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    approve(@Param('id') id: number) {
      return this.jobService.approve(id);
    }
  
    @Post(':id/reject')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    reject(@Param('id') id: number) {
      return this.jobService.reject(id);
    }
  }
  