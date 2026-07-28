import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthorToTestimonials1735734000000 implements MigrationInterface {
  name = 'AddAuthorToTestimonials1735734000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "authorId" uuid`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_testimonials_authorId" ON "testimonials" ("authorId")`);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'FK_testimonials_authorId'
        ) THEN
          ALTER TABLE "testimonials"
          ADD CONSTRAINT "FK_testimonials_authorId"
          FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "FK_testimonials_authorId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_testimonials_authorId"`);
    await queryRunner.query(`ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "authorId"`);
  }
}
