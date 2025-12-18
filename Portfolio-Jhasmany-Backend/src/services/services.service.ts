import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, authorId: string): Promise<Service> {
    const service = this.servicesRepository.create({
      ...createServiceDto,
      authorId,
    });
    return this.servicesRepository.save(service);
  }

  async findAll(published?: boolean): Promise<Service[]> {
    const query = this.servicesRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.author', 'author')
      .orderBy('service.order', 'ASC')
      .addOrderBy('service.createdAt', 'DESC');

    if (published !== undefined) {
      query.where('service.isPublished = :published', { published });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    await this.servicesRepository.update(id, updateServiceDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.servicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }

  async updateOrder(id: string, order: number): Promise<Service> {
    await this.servicesRepository.update(id, { order });
    return this.findOne(id);
  }

  async togglePublished(id: string): Promise<Service> {
    const service = await this.findOne(id);
    await this.servicesRepository.update(id, { isPublished: !service.isPublished });
    return this.findOne(id);
  }
}
