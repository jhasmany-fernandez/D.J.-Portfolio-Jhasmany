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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const home_entity_1 = require("./entities/home.entity");
let HomeService = class HomeService {
    constructor(homeSectionRepository) {
        this.homeSectionRepository = homeSectionRepository;
    }
    async create(createHomeDto, authorId) {
        const homeSection = this.homeSectionRepository.create({
            ...createHomeDto,
            authorId,
        });
        return await this.homeSectionRepository.save(homeSection);
    }
    async findAll() {
        return await this.homeSectionRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }
    async findActive() {
        return await this.homeSectionRepository.findOne({
            where: { isActive: true },
            relations: ['author'],
        });
    }
    async findOne(id) {
        const homeSection = await this.homeSectionRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!homeSection) {
            throw new common_1.NotFoundException(`Home section with ID ${id} not found`);
        }
        return homeSection;
    }
    async update(id, updateHomeDto) {
        const homeSection = await this.findOne(id);
        Object.assign(homeSection, updateHomeDto);
        return await this.homeSectionRepository.save(homeSection);
    }
    async setActive(id) {
        await this.homeSectionRepository.update({}, { isActive: false });
        const homeSection = await this.findOne(id);
        homeSection.isActive = true;
        return await this.homeSectionRepository.save(homeSection);
    }
    async remove(id) {
        const homeSection = await this.findOne(id);
        await this.homeSectionRepository.remove(homeSection);
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(home_entity_1.HomeSection)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HomeService);
//# sourceMappingURL=home.service.js.map