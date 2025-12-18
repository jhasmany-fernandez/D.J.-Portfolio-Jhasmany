import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
export declare class HomeController {
    private readonly homeService;
    constructor(homeService: HomeService);
    create(createHomeDto: CreateHomeDto, req: any): Promise<import("./entities/home.entity").HomeSection>;
    findAll(): Promise<import("./entities/home.entity").HomeSection[]>;
    findActive(): Promise<import("./entities/home.entity").HomeSection>;
    findOne(id: string): Promise<import("./entities/home.entity").HomeSection>;
    update(id: string, updateHomeDto: UpdateHomeDto): Promise<import("./entities/home.entity").HomeSection>;
    setActive(id: string): Promise<import("./entities/home.entity").HomeSection>;
    remove(id: string): Promise<void>;
}
