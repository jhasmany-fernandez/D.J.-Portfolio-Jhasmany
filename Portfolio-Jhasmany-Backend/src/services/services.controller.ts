import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  create(@Body() createServiceDto: CreateServiceDto, @Request() req) {
    // Use a default author ID if no authentication
    const authorId = req?.user?.userId || '1b4d78ea-4cad-4daa-9b42-0dd30436b980';
    return this.servicesService.create(createServiceDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Return all services' })
  findAll(@Query('published') published?: string) {
    const isPublished = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.servicesService.findAll(isPublished);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, description: 'Return the service' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Patch(':id/order')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service order' })
  updateOrder(@Param('id') id: string, @Body('order') order: number) {
    return this.servicesService.updateOrder(id, order);
  }

  @Patch(':id/toggle-published')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle service published status' })
  togglePublished(@Param('id') id: string) {
    return this.servicesService.togglePublished(id);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
