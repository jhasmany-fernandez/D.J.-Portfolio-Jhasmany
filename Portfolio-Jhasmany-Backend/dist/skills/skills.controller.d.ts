import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(createSkillDto: CreateSkillDto, req: any): Promise<import("./entities/skill.entity").Skill>;
    findAll(published?: string): Promise<import("./entities/skill.entity").Skill[]>;
    findOne(id: string): Promise<import("./entities/skill.entity").Skill>;
    update(id: string, updateSkillDto: UpdateSkillDto): Promise<import("./entities/skill.entity").Skill>;
    updateOrder(id: string, order: number): Promise<import("./entities/skill.entity").Skill>;
    togglePublished(id: string): Promise<import("./entities/skill.entity").Skill>;
    remove(id: string): Promise<void>;
}
