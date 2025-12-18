import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
export declare class SkillsService {
    private skillsRepository;
    constructor(skillsRepository: Repository<Skill>);
    create(createSkillDto: CreateSkillDto, authorId: string): Promise<Skill>;
    findAll(published?: boolean): Promise<Skill[]>;
    findOne(id: string): Promise<Skill>;
    update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill>;
    private deleteImageFile;
    remove(id: string): Promise<void>;
    updateOrder(id: string, order: number): Promise<Skill>;
    togglePublished(id: string): Promise<Skill>;
}
