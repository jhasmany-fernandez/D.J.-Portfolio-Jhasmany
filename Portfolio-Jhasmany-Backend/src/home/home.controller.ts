import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new home section' })
  @ApiResponse({ status: 201, description: 'Home section created successfully' })
  create(@Body() createHomeDto: CreateHomeDto, @Request() req) {
    const authorId = req?.user?.userId || '1b4d78ea-4cad-4daa-9b42-0dd30436b980';
    return this.homeService.create(createHomeDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all home sections' })
  @ApiResponse({ status: 200, description: 'Return all home sections' })
  findAll() {
    return this.homeService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active home section' })
  @ApiResponse({ status: 200, description: 'Return the active home section' })
  async findActive() {
    const activeSection = await this.homeService.findActive();
    if (!activeSection) {
      return { homeSection: null };
    }
    return activeSection;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a home section by ID' })
  @ApiResponse({ status: 200, description: 'Return the home section' })
  @ApiResponse({ status: 404, description: 'Home section not found' })
  findOne(@Param('id') id: string) {
    return this.homeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a home section' })
  @ApiResponse({ status: 200, description: 'Home section updated successfully' })
  update(@Param('id') id: string, @Body() updateHomeDto: UpdateHomeDto) {
    return this.homeService.update(id, updateHomeDto);
  }

  @Patch(':id/set-active')
  @ApiOperation({ summary: 'Set home section as active' })
  @ApiResponse({ status: 200, description: 'Home section set as active' })
  setActive(@Param('id') id: string) {
    return this.homeService.setActive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a home section' })
  @ApiResponse({ status: 200, description: 'Home section deleted successfully' })
  remove(@Param('id') id: string) {
    return this.homeService.remove(id);
  }
}
