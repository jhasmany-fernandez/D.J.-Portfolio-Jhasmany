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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { demoDeleted, demoEntity, isVisitor } from '../auth/utils/demo-response';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  async create(@Body() createSkillDto: CreateSkillDto, @Request() req) {
    if (isVisitor(req)) {
      return demoEntity(createSkillDto);
    }
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto, @Request() req) {
    if (isVisitor(req)) {
      return this.skillsService.findOne(id).then((skill) => demoEntity(updateSkillDto, skill));
    }
    return this.skillsService.update(id, updateSkillDto);
  }

  @Patch(':id/order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update skill order' })
  updateOrder(@Param('id') id: string, @Body('order') order: number, @Request() req) {
    if (isVisitor(req)) {
      return this.skillsService.findOne(id).then((skill) => demoEntity({ order }, skill));
    }
    return this.skillsService.updateOrder(id, order);
  }

  @Patch(':id/toggle-published')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle skill published status' })
  togglePublished(@Param('id') id: string, @Request() req) {
    if (isVisitor(req)) {
      return this.skillsService
        .findOne(id)
        .then((skill) => demoEntity({ isPublished: !skill.isPublished }, skill));
    }
    return this.skillsService.togglePublished(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    if (isVisitor(req)) {
      return demoDeleted(id);
    }
    return this.skillsService.remove(id);
  }
}
