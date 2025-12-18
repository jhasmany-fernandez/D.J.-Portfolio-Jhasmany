"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTechnologiesAndExperienceToServices1735729200000 = void 0;
const typeorm_1 = require("typeorm");
class AddTechnologiesAndExperienceToServices1735729200000 {
    async up(queryRunner) {
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'technologies',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'experienceLevel',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('services', 'experienceLevel');
        await queryRunner.dropColumn('services', 'technologies');
    }
}
exports.AddTechnologiesAndExperienceToServices1735729200000 = AddTechnologiesAndExperienceToServices1735729200000;
//# sourceMappingURL=1735729200000-AddTechnologiesAndExperienceToServices.js.map