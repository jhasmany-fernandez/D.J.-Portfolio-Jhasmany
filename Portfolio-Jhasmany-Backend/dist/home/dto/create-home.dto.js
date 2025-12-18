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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHomeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateHomeDto {
}
exports.CreateHomeDto = CreateHomeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Greeting text',
        example: "Hi - I'm Jhasmany Fernandez",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHomeDto.prototype, "greeting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of roles to display',
        example: ['FULLSTACK DEVELOPER', 'INDIE HACKER', 'SOLOPRENEUR'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateHomeDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description text',
        example: 'Crafting innovative solutions to solve real-world problems',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHomeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hero image URL',
        example: '/images/hero.png',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHomeDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this section is active',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHomeDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-home.dto.js.map