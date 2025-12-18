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
  Query,
  ParseUUIDPipe,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    // Use a default author ID if no authentication
    const authorId = req?.user?.userId || '04d0a5fa-a089-4faa-abe1-117a6bd67d17';
    return this.projectsService.create(createProjectDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  findAll(@Query('published') published?: string) {
    // Convert string to boolean if provided
    const publishedBool = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.projectsService.findAll(publishedBool);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user projects' })
  @ApiResponse({ status: 200, description: 'User projects retrieved successfully' })
  findMy(@Request() req) {
    return this.projectsService.findByAuthor(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Patch(':id/order')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project order' })
  @ApiResponse({ status: 200, description: 'Project order updated successfully' })
  updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('order', ParseIntPipe) order: number,
  ) {
    return this.projectsService.updateOrder(id, order);
  }

  @Patch(':id/toggle-published')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle project published status' })
  @ApiResponse({ status: 200, description: 'Project status toggled successfully' })
  togglePublished(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.togglePublished(id);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}