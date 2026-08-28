import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Job } from '../../job/entities/job.entity';
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYER = 'employer',
  JOB_SEEKER = 'job_seeker',
  EDITOR = 'editor',
}


@Entity()
export class User {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  username: string; // Stores custom role-based ID

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: false })
  is_banned: boolean;


  @OneToMany(() => Job, job => job.postedBy) 
  jobs: Job[]; 
}
