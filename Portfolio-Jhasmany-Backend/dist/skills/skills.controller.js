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
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const skills_service_1 = require("./skills.service");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const update_skill_dto_1 = require("./dto/update-skill.dto");
let SkillsController = class SkillsController {
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    create(createSkillDto, req) {
        const authorId = req?.user?.userId || '7e98afce-7e6e-47d9-b6fb-bea040874ebd';
        return this.skillsService.create(createSkillDto, authorId);
    }
    findAll(published) {
        const isPublished = published === 'true' ? true : published === 'false' ? false : undefined;
        return this.skillsService.findAll(isPublished);
    }
    findOne(id) {
        return this.skillsService.findOne(id);
    }
    update(id, updateSkillDto) {
        return this.skillsService.update(id, updateSkillDto);
    }
    updateOrder(id, order) {
        return this.skillsService.updateOrder(id, order);
    }
    togglePublished(id) {
        return this.skillsService.togglePublished(id);
    }
    remove(id) {
        return this.skillsService.remove(id);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new skill' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Skill created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_skill_dto_1.CreateSkillDto, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all skills' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all skills' }),
    __param(0, (0, common_1.Query)('published')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a skill by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the skill' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Skill not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a skill' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Skill updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_skill_dto_1.UpdateSkillDto]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/order'),
    (0, swagger_1.ApiOperation)({ summary: 'Update skill order' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-published'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle skill published status' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "togglePublished", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a skill' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Skill deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "remove", null);
exports.SkillsController = SkillsController = __decorate([
    (0, swagger_1.ApiTags)('skills'),
    (0, common_1.Controller)('skills'),
    __metadata("design:paramtypes", [skills_service_1.SkillsService])
], SkillsController);
//# sourceMappingURL=skills.controller.js.map