import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialsSectionService } from './testimonials-section.service';
import { TestimonialsSectionController } from './testimonials-section.controller';
import { TestimonialsSection } from './entities/testimonials-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestimonialsSection])],
  controllers: [TestimonialsSectionController],
  providers: [TestimonialsSectionService],
  exports: [TestimonialsSectionService],
})
export class TestimonialsSectionModule {}
