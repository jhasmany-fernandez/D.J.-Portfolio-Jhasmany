import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private readonly uploadService: UploadService,
  ) {}

  async create(createProjectDto: CreateProjectDto, authorId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      authorId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(published?: boolean): Promise<Project[]> {
    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.author', 'author')
      .orderBy('project.order', 'ASC')
      .addOrderBy('project.createdAt', 'DESC');

    if (published !== undefined) {
      query.where('project.isPublished = :published', { published });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByAuthor(authorId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    // Get existing project to check for old images
    const existingProject = await this.findOne(id);

    // Delete old images if new ones are provided
    if (updateProjectDto.imageUrl && existingProject.imageUrl) {
      await this.deleteImageFile(existingProject.imageUrl);
    }
    if (updateProjectDto.cover && existingProject.cover) {
      await this.deleteImageFile(existingProject.cover);
    }

    await this.projectsRepository.update(id, updateProjectDto);
    return this.findOne(id);
  }

  /**
   * Helper method to delete image file from uploads directory
   */
  private async deleteImageFile(imageUrl: string): Promise<void> {
    try {
      const deletedFromDatabase = await this.uploadService.deleteImageFromUrl(imageUrl);
      if (deletedFromDatabase) {
        return;
      }

      // Extract filename from URL
      // URLs can be: /api/images/filename.jpg or /uploads/filename.jpg or full URL
      const filename = imageUrl.split('/').pop();
      if (!filename) return;

      const filePath = join(process.cwd(), 'uploads', filename);

      // Check if file exists before attempting to delete
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (error) {
        // File doesn't exist or can't be accessed, ignore
      }
    } catch (error) {
      console.error('Error deleting image file:', error);
      // Don't throw error, just log it - we don't want to fail the update if image deletion fails
    }
  }

  async remove(id: string): Promise<void> {
    // Get project to delete associated images
    const project = await this.findOne(id);

    // Delete associated image files
    if (project.imageUrl) {
      await this.deleteImageFile(project.imageUrl);
    }
    if (project.cover) {
      await this.deleteImageFile(project.cover);
    }

    const result = await this.projectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async updateOrder(id: string, order: number): Promise<Project> {
    await this.projectsRepository.update(id, { order });
    return this.findOne(id);
  }

  async togglePublished(id: string): Promise<Project> {
    const project = await this.findOne(id);
    await this.projectsRepository.update(id, { isPublished: !project.isPublished });
    return this.findOne(id);
  }
}
