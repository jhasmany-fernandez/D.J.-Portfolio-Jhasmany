"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServices1735729000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateServices1735729000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'services',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'shortDescription',
                    type: 'text',
                },
                {
                    name: 'icon',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'order',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'isPublished',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'authorId',
                    type: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('services', new typeorm_1.TableForeignKey({
            columnNames: ['authorId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('services');
    }
}
exports.CreateServices1735729000000 = CreateServices1735729000000;
//# sourceMappingURL=1735729000000-CreateServices.js.map