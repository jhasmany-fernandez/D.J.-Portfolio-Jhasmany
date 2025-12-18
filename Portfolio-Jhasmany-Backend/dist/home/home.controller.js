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
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const home_service_1 = require("./home.service");
const create_home_dto_1 = require("./dto/create-home.dto");
const update_home_dto_1 = require("./dto/update-home.dto");
let HomeController = class HomeController {
    constructor(homeService) {
        this.homeService = homeService;
    }
    create(createHomeDto, req) {
        const authorId = req?.user?.userId || '7e98afce-7e6e-47d9-b6fb-bea040874ebd';
        return this.homeService.create(createHomeDto, authorId);
    }
    findAll() {
        return this.homeService.findAll();
    }
    findActive() {
        return this.homeService.findActive();
    }
    findOne(id) {
        return this.homeService.findOne(id);
    }
    update(id, updateHomeDto) {
        return this.homeService.update(id, updateHomeDto);
    }
    setActive(id) {
        return this.homeService.setActive(id);
    }
    remove(id) {
        return this.homeService.remove(id);
    }
};
exports.HomeController = HomeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new home section' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Home section created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_home_dto_1.CreateHomeDto, Object]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all home sections' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all home sections' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active home section' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the active home section' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a home section by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the home section' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Home section not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a home section' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Home section updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_home_dto_1.UpdateHomeDto]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/set-active'),
    (0, swagger_1.ApiOperation)({ summary: 'Set home section as active' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Home section set as active' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "setActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a home section' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Home section deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "remove", null);
exports.HomeController = HomeController = __decorate([
    (0, swagger_1.ApiTags)('home'),
    (0, common_1.Controller)('home'),
    __metadata("design:paramtypes", [home_service_1.HomeService])
], HomeController);
//# sourceMappingURL=home.controller.js.map