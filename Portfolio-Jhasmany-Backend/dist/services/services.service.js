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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_entity_1 = require("./entities/service.entity");
let ServicesService = class ServicesService {
    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }
    async create(createServiceDto, authorId) {
        const service = this.servicesRepository.create({
            ...createServiceDto,
            authorId,
        });
        return this.servicesRepository.save(service);
    }
    async findAll(published) {
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
    async findOne(id) {
        const service = await this.servicesRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }
    async update(id, updateServiceDto) {
        await this.servicesRepository.update(id, updateServiceDto);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.servicesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
    }
    async updateOrder(id, order) {
        await this.servicesRepository.update(id, { order });
        return this.findOne(id);
    }
    async togglePublished(id) {
        const service = await this.findOne(id);
        await this.servicesRepository.update(id, { isPublished: !service.isPublished });
        return this.findOne(id);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map