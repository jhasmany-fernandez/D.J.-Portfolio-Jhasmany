"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddImageUrlToServices1735729100000 = void 0;
const typeorm_1 = require("typeorm");
class AddImageUrlToServices1735729100000 {
    async up(queryRunner) {
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'imageUrl',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('services', 'imageUrl');
    }
}
exports.AddImageUrlToServices1735729100000 = AddImageUrlToServices1735729100000;
//# sourceMappingURL=1735729100000-AddImageUrlToServices.js.map