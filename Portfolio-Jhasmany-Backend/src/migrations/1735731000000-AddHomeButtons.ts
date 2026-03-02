import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHomeButtons1735731000000 implements MigrationInterface {
  name = 'AddHomeButtons1735731000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "primaryButtonText" character varying NOT NULL DEFAULT 'Acceso Personal'`,
    );
    await queryRunner.query(
      `ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "primaryButtonUrl" character varying NOT NULL DEFAULT '/auth/login'`,
    );
    await queryRunner.query(
      `ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "secondaryButtonText" character varying NOT NULL DEFAULT 'Newsletter Clientes'`,
    );
    await queryRunner.query(
      `ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "secondaryButtonUrl" character varying NOT NULL DEFAULT '/newsletter/subscribe'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "secondaryButtonUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "secondaryButtonText"`,
    );
    await queryRunner.query(
      `ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "primaryButtonUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "primaryButtonText"`,
    );
  }
}
