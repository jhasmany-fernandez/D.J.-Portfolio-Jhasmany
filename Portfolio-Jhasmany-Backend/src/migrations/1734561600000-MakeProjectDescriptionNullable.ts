import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeProjectDescriptionNullable1734561600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "description" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "description" SET NOT NULL`
    );
  }
}
