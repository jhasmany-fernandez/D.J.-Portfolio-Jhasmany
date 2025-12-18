import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  shortDescription: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('simple-array', { nullable: true })
  technologies: string[];

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  demoUrl: string;

  @Column({ nullable: true })
  livePreview: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  githubLink: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ default: 1 })
  priority: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  visitors: string;

  @Column({ nullable: true })
  earned: string;

  @Column({ nullable: true })
  githubStars: string;

  @Column({ nullable: true })
  numberOfSales: string;

  @Column({ nullable: true })
  siteAge: string;

  @Column({ nullable: true })
  ratings: string;

  @Column({ default: false })
  showLivePreviewInPortfolio: boolean;

  @Column({ default: false })
  showGithubInPortfolio: boolean;

  @Column({ default: false })
  showVisitorsInPortfolio: boolean;

  @Column({ default: false })
  showEarnedInPortfolio: boolean;

  @Column({ default: false })
  showGithubStarsInPortfolio: boolean;

  @Column({ default: false })
  showRatingsInPortfolio: boolean;

  @Column({ default: false })
  showNumberOfSalesInPortfolio: boolean;

  @Column({ default: false })
  showSiteAgeInPortfolio: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column('uuid')
  authorId: string;
}