// src/job/job.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  // async create(createJobDto: CreateJobDto, user: User) {
  //   const job = this.jobRepository.create({ ...createJobDto, postedBy: user });
  //   return this.jobRepository.save(job);
  // }

  async create(createJobDto: CreateJobDto, user: User) {
    // Log the incoming data from the CreateJobDto
    // console.log('Incoming job data:', createJobDto);

    // Create the job entity from DTO and add the postedBy user
    const job = this.jobRepository.create({
      ...createJobDto,
      postedBy: user,  // Assuming the user is posted here (change this as per your logic)
    });

    // Log the job entity before saving
    // console.log('Job entity to be saved:', job);

    // Save the job entity to the database
    return this.jobRepository.save(job);
  }


  // findAll(filter?: string) {
  //   return this.jobRepository.find({
  //     where: filter ? { title: Like(`%${filter}%`) } : {},
  //     relations: ['postedBy'],
  //   });
  // }

  // findAll(filter?: string) {
  //   // console.log('Filter received:', filter); // Log filter value
  //   // If filter is passed, search the title field. If not, return all jobs.
  //   return this.jobRepository.find({
  //     where: filter ? { title: Like(`%${filter}%`) } : {}, // Apply filter on title
  //     relations: ['postedBy'], // Include the 'postedBy' relation (user data)
  //   });
  // }

  async findAll(filter?: string) {
    const jobs = await this.jobRepository.find({
      where: filter ? { title: Like(`%${filter}%`) } : {},
      relations: ['postedBy'],
    });
  
    return jobs.map(job => {
      const { password, ...postedBySafe } = job.postedBy;
      return {
        ...job,
        postedBy: postedBySafe,
      };
    });
  }
  

  findOne(id: number) {
    return this.jobRepository.findOne({ where: { id }, relations: ['postedBy'] });
  }

  async update(id: number, updateDto: UpdateJobDto) {
    const job = await this.jobRepository.preload({ id, ...updateDto });
    if (!job) throw new NotFoundException('Job not found');
    return this.jobRepository.save(job);
  }

  async remove(id: number) {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) throw new NotFoundException('Job not found');
    return this.jobRepository.remove(job);
  }

  // async approve(id: number) {
  //   const job = await this.findOne(id);
  //   if (!job) {
  //     throw new NotFoundException('Job not found');
  //   }
  //   job.status = JobStatus.APPROVED;
  //   return this.jobRepository.save(job);
  // }

  async approve(id: number) {
    const job = await this.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
  
    job.status = JobStatus.APPROVED;
    const updatedJob = await this.jobRepository.save(job);
  
    const { password, ...postedBySafe } = updatedJob.postedBy;
    return {
      ...updatedJob,
      postedBy: postedBySafe,
    };
  }
  

  // async reject(id: number) {
  //   const job = await this.findOne(id);
  
  //   if (!job) {
  //     throw new NotFoundException('Job not found');
  //   }
  
  //   job.status = JobStatus.REJECTED;
  //   return this.jobRepository.save(job);
  // }

  async reject(id: number) {
    const job = await this.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
  
    job.status = JobStatus.REJECTED;
    const updatedJob = await this.jobRepository.save(job);
  
    const { password, ...postedBySafe } = updatedJob.postedBy;
    return {
      ...updatedJob,
      postedBy: postedBySafe,
    };
  }
  
}
