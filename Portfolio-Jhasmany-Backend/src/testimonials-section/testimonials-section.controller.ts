import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TestimonialsSectionService } from './testimonials-section.service';
import { UpdateTestimonialsSectionDto } from './dto/update-testimonials-section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { demoEntity, isVisitor } from '../auth/utils/demo-response';

@Controller('testimonials-section')
export class TestimonialsSectionController {
  constructor(private readonly testimonialsSectionService: TestimonialsSectionService) {}

  @Get('active')
  getActive() {
    return this.testimonialsSectionService.getActive();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateDto: UpdateTestimonialsSectionDto, @Request() req) {
    if (isVisitor(req)) {
      return this.testimonialsSectionService.getActive().then((section) => demoEntity(updateDto, section));
    }
    return this.testimonialsSectionService.update(id, updateDto);
  }
}
