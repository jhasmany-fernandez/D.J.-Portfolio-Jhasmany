import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTechnologiesAndExperienceToServices1735729200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'technologies',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'experienceLevel',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('services', 'experienceLevel');
    await queryRunner.dropColumn('services', 'technologies');
  }
}
