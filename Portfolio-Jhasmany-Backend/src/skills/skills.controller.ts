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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { UsersService } from '../users/users.service';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  async create(@Body() createSkillDto: CreateSkillDto, @Request() req) {
    const authorIdFromToken = req?.user?.userId;
    const defaultAuthorEmail =
      process.env.DEFAULT_AUTHOR_EMAIL || 'jhasmany.fernandez.dev@gmail.com';

    const defaultAuthor = await this.usersService.findByEmail(defaultAuthorEmail);
    const fallbackAuthorId =
      defaultAuthor?.id || (await this.usersService.findAll())[0]?.id;

    const authorId = authorIdFromToken || fallbackAuthorId;
    if (!authorId) {
      throw new BadRequestException(
        'No valid author found to create the skill. Create a user first.',
      );
    }

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
