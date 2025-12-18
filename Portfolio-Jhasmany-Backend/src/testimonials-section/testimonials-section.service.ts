import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestimonialsSection } from './entities/testimonials-section.entity';
import { UpdateTestimonialsSectionDto } from './dto/update-testimonials-section.dto';

@Injectable()
export class TestimonialsSectionService {
  constructor(
    @InjectRepository(TestimonialsSection)
    private testimonialsSectionRepository: Repository<TestimonialsSection>,
  ) {}

  async getActive(): Promise<TestimonialsSection> {
    const section = await this.testimonialsSectionRepository.findOne({
      where: { isActive: true },
    });

    if (!section) {
      // Create default if not exists
      const defaultSection = this.testimonialsSectionRepository.create({
        subtitle: "Don't just take our word for it - see what actual users of our service have to say about their experience.",
        isActive: true,
      });
      return await this.testimonialsSectionRepository.save(defaultSection);
    }

    return section;
  }

  async update(id: string, updateDto: UpdateTestimonialsSectionDto): Promise<TestimonialsSection> {
    await this.testimonialsSectionRepository.update(id, updateDto);
    return await this.testimonialsSectionRepository.findOne({ where: { id } });
  }
}
