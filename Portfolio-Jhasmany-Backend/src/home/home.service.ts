import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { HomeSection } from './entities/home.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(HomeSection)
    private homeSectionRepository: Repository<HomeSection>,
  ) {}

  async create(createHomeDto: CreateHomeDto, authorId: string): Promise<HomeSection> {
    const homeSection = this.homeSectionRepository.create({
      ...createHomeDto,
      authorId,
    });
    return await this.homeSectionRepository.save(homeSection);
  }

  async findAll(): Promise<HomeSection[]> {
    return await this.homeSectionRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<HomeSection | null> {
    return await this.homeSectionRepository.findOne({
      where: { isActive: true },
      relations: ['author'],
    });
  }

  async findOne(id: string): Promise<HomeSection> {
    const homeSection = await this.homeSectionRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!homeSection) {
      throw new NotFoundException(`Home section with ID ${id} not found`);
    }

    return homeSection;
  }

  async update(id: string, updateHomeDto: UpdateHomeDto): Promise<HomeSection> {
    const homeSection = await this.findOne(id);
    Object.assign(homeSection, updateHomeDto);
    return await this.homeSectionRepository.save(homeSection);
  }

  async setActive(id: string): Promise<HomeSection> {
    // Deactivate all other sections
    await this.homeSectionRepository.update(
      {},
      { isActive: false },
    );

    // Activate the selected one
    const homeSection = await this.findOne(id);
    homeSection.isActive = true;
    return await this.homeSectionRepository.save(homeSection);
  }

  async remove(id: string): Promise<void> {
    const homeSection = await this.findOne(id);
    await this.homeSectionRepository.remove(homeSection);
  }
}
