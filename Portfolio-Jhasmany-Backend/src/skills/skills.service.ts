import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto, authorId: string): Promise<Skill> {
    const skill = this.skillsRepository.create({
      ...createSkillDto,
      authorId,
    });
    return this.skillsRepository.save(skill);
  }

  async findAll(published?: boolean): Promise<Skill[]> {
    const query = this.skillsRepository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.author', 'author')
      .orderBy('skill.order', 'ASC')
      .addOrderBy('skill.createdAt', 'DESC');

    if (published !== undefined) {
      query.where('skill.isPublished = :published', { published });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const existingSkill = await this.findOne(id);

    // Delete old image if new one is provided
    if (updateSkillDto.imageUrl && existingSkill.imageUrl) {
      await this.deleteImageFile(existingSkill.imageUrl);
    }

    await this.skillsRepository.update(id, updateSkillDto);
    return this.findOne(id);
  }

  private async deleteImageFile(imageUrl: string): Promise<void> {
    try {
      const filename = imageUrl.split('/').pop();
      if (!filename) return;

      const filePath = join(process.cwd(), 'uploads', filename);

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Deleted old image: ${filename}`);
      } catch (error) {
        console.log(`Image file not found or already deleted: ${filename}`);
      }
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
  }

  async remove(id: string): Promise<void> {
    const skill = await this.findOne(id);

    if (skill.imageUrl) {
      await this.deleteImageFile(skill.imageUrl);
    }

    const result = await this.skillsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
  }

  async updateOrder(id: string, order: number): Promise<Skill> {
    await this.skillsRepository.update(id, { order });
    return this.findOne(id);
  }

  async togglePublished(id: string): Promise<Skill> {
    const skill = await this.findOne(id);
    await this.skillsRepository.update(id, { isPublished: !skill.isPublished });
    return this.findOne(id);
  }
}
