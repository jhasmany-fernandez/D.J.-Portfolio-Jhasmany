import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpanishContentFields1735735000000 implements MigrationInterface {
  name = 'AddSpanishContentFields1735735000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "greetingEs" character varying`);
    await queryRunner.query(`ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "rolesEs" text`);
    await queryRunner.query(`ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "descriptionEs" character varying`);
    await queryRunner.query(`ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "primaryButtonTextEs" character varying`);
    await queryRunner.query(`ALTER TABLE "home_sections" ADD COLUMN IF NOT EXISTS "secondaryButtonTextEs" character varying`);

    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "titleEs" character varying`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "descriptionEs" text`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "shortDescriptionEs" text`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "contentEs" text`);

    await queryRunner.query(`ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "titleEs" character varying`);
    await queryRunner.query(`ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "shortDescriptionEs" text`);

    await queryRunner.query(`ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "titleEs" character varying`);
    await queryRunner.query(`ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "feedbackEs" text`);

    await queryRunner.query(`ALTER TABLE "services_section" ADD COLUMN IF NOT EXISTS "subtitleEs" text`);
    await queryRunner.query(`ALTER TABLE "testimonials_section" ADD COLUMN IF NOT EXISTS "subtitleEs" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "testimonials_section" DROP COLUMN IF EXISTS "subtitleEs"`);
    await queryRunner.query(`ALTER TABLE "services_section" DROP COLUMN IF EXISTS "subtitleEs"`);

    await queryRunner.query(`ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "feedbackEs"`);
    await queryRunner.query(`ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "titleEs"`);

    await queryRunner.query(`ALTER TABLE "services" DROP COLUMN IF EXISTS "shortDescriptionEs"`);
    await queryRunner.query(`ALTER TABLE "services" DROP COLUMN IF EXISTS "titleEs"`);

    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "contentEs"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "shortDescriptionEs"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "descriptionEs"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "titleEs"`);

    await queryRunner.query(`ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "secondaryButtonTextEs"`);
    await queryRunner.query(`ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "primaryButtonTextEs"`);
    await queryRunner.query(`ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "descriptionEs"`);
    await queryRunner.query(`ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "rolesEs"`);
    await queryRunner.query(`ALTER TABLE "home_sections" DROP COLUMN IF EXISTS "greetingEs"`);
  }
}
