// src/job/dto/create-job.dto.ts
import { JobStatus } from '../entities/job.entity';
export class CreateJobDto {
    title: string;
    description: string;
    status: JobStatus = JobStatus.PENDING;
  }
  
  // // src/job/dto/update-job.dto.ts
  // export class UpdateJobDto {
  //   title?: string;
  //   description?: string;
  // }
  