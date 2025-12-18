import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { TestimonialsSectionService } from './testimonials-section.service';
import { UpdateTestimonialsSectionDto } from './dto/update-testimonials-section.dto';

@Controller('testimonials-section')
export class TestimonialsSectionController {
  constructor(private readonly testimonialsSectionService: TestimonialsSectionService) {}

  @Get('active')
  getActive() {
    return this.testimonialsSectionService.getActive();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateTestimonialsSectionDto) {
    return this.testimonialsSectionService.update(id, updateDto);
  }
}
