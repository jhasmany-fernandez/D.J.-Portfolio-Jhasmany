import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  create(@Body() createSkillDto: CreateSkillDto, @Request() req) {
    const authorId = req?.user?.userId || '1b4d78ea-4cad-4daa-9b42-0dd30436b980';
    return this.skillsService.create(createSkillDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, description: 'Return all skills' })
  findAll(@Query('published') published?: string) {
    const isPublished = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.skillsService.findAll(isPublished);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a skill by ID' })
  @ApiResponse({ status: 200, description: 'Return the skill' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a skill' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Patch(':id/order')
  @ApiOperation({ summary: 'Update skill order' })
  updateOrder(@Param('id') id: string, @Body('order') order: number) {
    return this.skillsService.updateOrder(id, order);
  }

  @Patch(':id/toggle-published')
  @ApiOperation({ summary: 'Toggle skill published status' })
  togglePublished(@Param('id') id: string) {
    return this.skillsService.togglePublished(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
