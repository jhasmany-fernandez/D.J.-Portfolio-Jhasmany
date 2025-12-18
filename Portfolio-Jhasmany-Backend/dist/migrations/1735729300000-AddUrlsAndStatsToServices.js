"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUrlsAndStatsToServices1735729300000 = void 0;
const typeorm_1 = require("typeorm");
class AddUrlsAndStatsToServices1735729300000 {
    async up(queryRunner) {
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'demoUrl',
            type: 'varchar',
            isNullable: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'githubUrl',
            type: 'varchar',
            isNullable: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'clientsServed',
            type: 'varchar',
            isNullable: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'projectsCompleted',
            type: 'varchar',
            isNullable: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'ratings',
            type: 'varchar',
            isNullable: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'showDemoInPortfolio',
            type: 'boolean',
            default: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'showGithubInPortfolio',
            type: 'boolean',
            default: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'showClientsServedInPortfolio',
            type: 'boolean',
            default: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'showProjectsCompletedInPortfolio',
            type: 'boolean',
            default: true,
        }));
        await queryRunner.addColumn('services', new typeorm_1.TableColumn({
            name: 'showRatingsInPortfolio',
            type: 'boolean',
            default: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('services', 'showRatingsInPortfolio');
        await queryRunner.dropColumn('services', 'showProjectsCompletedInPortfolio');
        await queryRunner.dropColumn('services', 'showClientsServedInPortfolio');
        await queryRunner.dropColumn('services', 'showGithubInPortfolio');
        await queryRunner.dropColumn('services', 'showDemoInPortfolio');
        await queryRunner.dropColumn('services', 'ratings');
        await queryRunner.dropColumn('services', 'projectsCompleted');
        await queryRunner.dropColumn('services', 'clientsServed');
        await queryRunner.dropColumn('services', 'githubUrl');
        await queryRunner.dropColumn('services', 'demoUrl');
    }
}
exports.AddUrlsAndStatsToServices1735729300000 = AddUrlsAndStatsToServices1735729300000;
//# sourceMappingURL=1735729300000-AddUrlsAndStatsToServices.js.map