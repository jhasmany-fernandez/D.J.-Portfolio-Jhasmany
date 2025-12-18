import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  shortDescription: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('simple-array', { nullable: true })
  technologies: string[];

  @Column({ nullable: true })
  experienceLevel: string;

  @Column({ nullable: true })
  demoUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  clientsServed: string;

  @Column({ nullable: true })
  projectsCompleted: string;

  @Column({ nullable: true })
  ratings: string;

  @Column({ type: 'boolean', default: true })
  showDemoInPortfolio: boolean;

  @Column({ type: 'boolean', default: true })
  showGithubInPortfolio: boolean;

  @Column({ type: 'boolean', default: true })
  showClientsServedInPortfolio: boolean;

  @Column({ type: 'boolean', default: true })
  showProjectsCompletedInPortfolio: boolean;

  @Column({ type: 'boolean', default: true })
  showRatingsInPortfolio: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @Column({ type: 'uuid', nullable: true })
  authorId: string;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
