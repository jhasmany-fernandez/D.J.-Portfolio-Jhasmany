import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStoredImages1735730000000 implements MigrationInterface {
  name = 'CreateStoredImages1735730000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "stored_images" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "originalName" character varying(255) NOT NULL,
        "mimeType" character varying(100) NOT NULL,
        "size" integer NOT NULL,
        "data" bytea NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_stored_images_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "stored_images"`);
  }
}
