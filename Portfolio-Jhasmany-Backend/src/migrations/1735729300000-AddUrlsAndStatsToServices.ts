import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUrlsAndStatsToServices1735729300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add URL fields
    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'demoUrl',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'githubUrl',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Add statistics fields
    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'clientsServed',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'projectsCompleted',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'ratings',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Add visibility toggle fields
    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'showDemoInPortfolio',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'showGithubInPortfolio',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'showClientsServedInPortfolio',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'showProjectsCompletedInPortfolio',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'showRatingsInPortfolio',
        type: 'boolean',
        default: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
