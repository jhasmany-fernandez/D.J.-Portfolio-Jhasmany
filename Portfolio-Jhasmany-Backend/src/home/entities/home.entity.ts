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

@Entity('home_sections')
export class HomeSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  greeting: string;

  @Column({ nullable: true })
  greetingEs: string;

  @Column('simple-array')
  roles: string[];

  @Column('simple-array', { nullable: true })
  rolesEs: string[];

  @Column()
  description: string;

  @Column({ nullable: true })
  descriptionEs: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 'Acceso Personal' })
  primaryButtonText: string;

  @Column({ nullable: true })
  primaryButtonTextEs: string;

  @Column({ default: '/auth/login' })
  primaryButtonUrl: string;

  @Column({ default: 'Newsletter Clientes' })
  secondaryButtonText: string;

  @Column({ nullable: true })
  secondaryButtonTextEs: string;

  @Column({ default: '/newsletter/subscribe' })
  secondaryButtonUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.homeSections, { nullable: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column('uuid', { nullable: true })
  authorId: string;
}
