import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWhatsappToFooter1735735200000 implements MigrationInterface {
  name = 'AddWhatsappToFooter1735735200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "footer"
      ADD COLUMN IF NOT EXISTS "whatsappNumber" character varying DEFAULT ''
    `);

    await queryRunner.query(`
      UPDATE "footer"
      SET "whatsappNumber" = regexp_replace("phone", '[^0-9]', '', 'g')
      WHERE COALESCE("whatsappNumber", '') = ''
        AND COALESCE("phone", '') <> ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "footer"
      DROP COLUMN IF EXISTS "whatsappNumber"
    `);
  }
}
