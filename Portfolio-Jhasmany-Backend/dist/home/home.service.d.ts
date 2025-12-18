import { Repository } from 'typeorm';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { HomeSection } from './entities/home.entity';
export declare class HomeService {
    private homeSectionRepository;
    constructor(homeSectionRepository: Repository<HomeSection>);
    create(createHomeDto: CreateHomeDto, authorId: string): Promise<HomeSection>;
    findAll(): Promise<HomeSection[]>;
    findActive(): Promise<HomeSection | null>;
    findOne(id: string): Promise<HomeSection>;
    update(id: string, updateHomeDto: UpdateHomeDto): Promise<HomeSection>;
    setActive(id: string): Promise<HomeSection>;
    remove(id: string): Promise<void>;
}
