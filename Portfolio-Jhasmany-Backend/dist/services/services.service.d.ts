import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private servicesRepository;
    constructor(servicesRepository: Repository<Service>);
    create(createServiceDto: CreateServiceDto, authorId: string): Promise<Service>;
    findAll(published?: boolean): Promise<Service[]>;
    findOne(id: string): Promise<Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
    remove(id: string): Promise<void>;
    updateOrder(id: string, order: number): Promise<Service>;
    togglePublished(id: string): Promise<Service>;
}
