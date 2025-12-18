import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicesSection } from './entities/services-section.entity';
import { UpdateServicesSectionDto } from './dto/update-services-section.dto';

@Injectable()
export class ServicesSectionService {
  constructor(
    @InjectRepository(ServicesSection)
    private servicesSectionRepository: Repository<ServicesSection>,
  ) {}

  async getActive(): Promise<ServicesSection> {
    const section = await this.servicesSectionRepository.findOne({
      where: { isActive: true },
    });

    if (!section) {
      // Create default if not exists
      const defaultSection = this.servicesSectionRepository.create({
        subtitle: 'I offer a wide range of services to ensure you have the best written code and stay ahead in the competition.',
        isActive: true,
      });
      return await this.servicesSectionRepository.save(defaultSection);
    }

    return section;
  }

  async update(id: string, updateDto: UpdateServicesSectionDto): Promise<ServicesSection> {
    await this.servicesSectionRepository.update(id, updateDto);
    return await this.servicesSectionRepository.findOne({ where: { id } });
  }
}
