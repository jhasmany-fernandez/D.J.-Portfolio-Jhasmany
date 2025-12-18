"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHomeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_home_dto_1 = require("./create-home.dto");
class UpdateHomeDto extends (0, swagger_1.PartialType)(create_home_dto_1.CreateHomeDto) {
}
exports.UpdateHomeDto = UpdateHomeDto;
//# sourceMappingURL=update-home.dto.js.map