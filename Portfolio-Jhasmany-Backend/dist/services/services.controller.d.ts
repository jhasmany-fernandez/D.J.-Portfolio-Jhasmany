import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto, req: any): Promise<import("./entities/service.entity").Service>;
    findAll(published?: string): Promise<import("./entities/service.entity").Service[]>;
    findOne(id: string): Promise<import("./entities/service.entity").Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("./entities/service.entity").Service>;
    updateOrder(id: string, order: number): Promise<import("./entities/service.entity").Service>;
    togglePublished(id: string): Promise<import("./entities/service.entity").Service>;
    remove(id: string): Promise<void>;
}
