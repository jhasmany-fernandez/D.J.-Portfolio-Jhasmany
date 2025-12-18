import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHomeSections1735729400000 implements MigrationInterface {
  name = 'CreateHomeSections1735729400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "home_sections" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "greeting" character varying NOT NULL,
        "roles" text NOT NULL,
        "description" character varying NOT NULL,
        "imageUrl" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "authorId" uuid,
        CONSTRAINT "PK_home_sections" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "home_sections"
      ADD CONSTRAINT "FK_home_sections_authorId"
      FOREIGN KEY ("authorId")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "home_sections"
      DROP CONSTRAINT "FK_home_sections_authorId"
    `);

    await queryRunner.query(`DROP TABLE "home_sections"`);
  }
}
