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

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  titleEs: string;

  @Column('text')
  feedback: string;

  @Column('text', { nullable: true })
  feedbackEs: string;

  @Column()
  image: string;

  @Column({ type: 'int', default: 5 })
  stars: number;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ type: 'uuid', nullable: true })
  authorId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
