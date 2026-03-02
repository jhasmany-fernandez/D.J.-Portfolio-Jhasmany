import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('footer')
export class Footer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column('text')
  description: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  locationLine1: string;

  @Column()
  locationLine2: string;

  // Social Media Links
  @Column({ nullable: true, default: '' })
  githubUrl: string;

  @Column({ nullable: true, default: '' })
  linkedinUrl: string;

  @Column({ nullable: true, default: '' })
  codepenUrl: string;

  @Column({ nullable: true, default: '' })
  twitterUrl: string;

  @Column({ nullable: true, default: '' })
  instagramUrl: string;

  @Column({ nullable: true, default: '' })
  facebookUrl: string;

  // Available Languages
  @Column({ type: 'simple-array', nullable: true, default: 'en,es' })
  availableLanguages: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
