// src/job/dto/update-job.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { JobStatus } from '../entities/job.entity';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
