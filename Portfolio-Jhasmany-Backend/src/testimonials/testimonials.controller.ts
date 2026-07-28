import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { demoDeleted, demoEntity, isVisitor } from '../auth/utils/demo-response';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'testimonial', 'visitor')
  @ApiBearerAuth()
  create(@Body() createTestimonialDto: CreateTestimonialDto, @Request() req) {
    if (isVisitor(req)) {
      return demoEntity(createTestimonialDto);
    }

    return this.testimonialsService.create(createTestimonialDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get('published')
  findAllPublished() {
    return this.testimonialsService.findAllPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'testimonial', 'visitor')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto, @Request() req) {
    if (isVisitor(req)) {
      return this.testimonialsService
        .findOne(id)
        .then((testimonial) => demoEntity(updateTestimonialDto, testimonial));
    }

    if (req.user.role === 'testimonial') {
      return this.testimonialsService.updateOwn(id, req.user.userId, updateTestimonialDto);
    }

    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req) {
    if (isVisitor(req)) {
      return demoDeleted(id);
    }
    return this.testimonialsService.remove(id);
  }
}
