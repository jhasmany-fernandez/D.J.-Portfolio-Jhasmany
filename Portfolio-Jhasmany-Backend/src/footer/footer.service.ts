import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Footer } from './entities/footer.entity';
import { UpdateFooterDto } from './dto/update-footer.dto';

@Injectable()
export class FooterService {
  constructor(
    @InjectRepository(Footer)
    private footerRepository: Repository<Footer>,
  ) {}

  async getActive(): Promise<Footer> {
    const footer = await this.footerRepository.findOne({
      where: { isActive: true },
    });

    if (!footer) {
      // Create default footer if none exists
      const defaultFooter = this.footerRepository.create({
        companyName: 'Jhasmany Fernández',
        description: 'Full-Stack Developer specializing in modern web technologies. Building scalable and performant applications with passion and precision.',
        email: 'jhasmany.fernandez.dev@gmail.com',
        phone: '+591 65856280',
        locationLine1: 'Santa Cruz de la Sierra',
        locationLine2: 'Bolivia',
        isActive: true,
      });
      return await this.footerRepository.save(defaultFooter);
    }

    return footer;
  }

  async update(id: string, updateFooterDto: UpdateFooterDto): Promise<Footer> {
    await this.footerRepository.update(id, updateFooterDto);
    return this.footerRepository.findOne({ where: { id } });
  }
}
