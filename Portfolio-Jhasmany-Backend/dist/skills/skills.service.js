"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_entity_1 = require("./entities/skill.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let SkillsService = class SkillsService {
    constructor(skillsRepository) {
        this.skillsRepository = skillsRepository;
    }
    async create(createSkillDto, authorId) {
        const skill = this.skillsRepository.create({
            ...createSkillDto,
            authorId,
        });
        return this.skillsRepository.save(skill);
    }
    async findAll(published) {
        const query = this.skillsRepository
            .createQueryBuilder('skill')
            .leftJoinAndSelect('skill.author', 'author')
            .orderBy('skill.order', 'ASC')
            .addOrderBy('skill.createdAt', 'DESC');
        if (published !== undefined) {
            query.where('skill.isPublished = :published', { published });
        }
        return query.getMany();
    }
    async findOne(id) {
        const skill = await this.skillsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!skill) {
            throw new common_1.NotFoundException(`Skill with ID ${id} not found`);
        }
        return skill;
    }
    async update(id, updateSkillDto) {
        const existingSkill = await this.findOne(id);
        if (updateSkillDto.imageUrl && existingSkill.imageUrl) {
            await this.deleteImageFile(existingSkill.imageUrl);
        }
        await this.skillsRepository.update(id, updateSkillDto);
        return this.findOne(id);
    }
    async deleteImageFile(imageUrl) {
        try {
            const filename = imageUrl.split('/').pop();
            if (!filename)
                return;
            const filePath = (0, path_1.join)(process.cwd(), 'uploads', filename);
            try {
                await fs_1.promises.access(filePath);
                await fs_1.promises.unlink(filePath);
                console.log(`Deleted old image: ${filename}`);
            }
            catch (error) {
                console.log(`Image file not found or already deleted: ${filename}`);
            }
        }
        catch (error) {
            console.error('Error deleting image file:', error);
        }
    }
    async remove(id) {
        const skill = await this.findOne(id);
        if (skill.imageUrl) {
            await this.deleteImageFile(skill.imageUrl);
        }
        const result = await this.skillsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Skill with ID ${id} not found`);
        }
    }
    async updateOrder(id, order) {
        await this.skillsRepository.update(id, { order });
        return this.findOne(id);
    }
    async togglePublished(id) {
        const skill = await this.findOne(id);
        await this.skillsRepository.update(id, { isPublished: !skill.isPublished });
        return this.findOne(id);
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SkillsService);
//# sourceMappingURL=skills.service.js.map