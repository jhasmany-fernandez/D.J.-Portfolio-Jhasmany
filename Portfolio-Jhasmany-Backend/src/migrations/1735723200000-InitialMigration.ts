import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1735723200000 implements MigrationInterface {
  name = 'InitialMigration1735723200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "name" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "content" text,
        "technologies" text,
        "imageUrl" character varying,
        "demoUrl" character varying,
        "githubUrl" character varying,
        "isPublished" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "authorId" uuid NOT NULL,
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id")
      )
    `);

    // Create contacts table
    await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "subject" character varying,
        "message" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "isReplied" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contacts_id" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "projects"
      ADD CONSTRAINT "FK_projects_authorId"
      FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_projects_authorId" ON "projects" ("authorId")`);
    await queryRunner.query(`CREATE INDEX "IDX_projects_isPublished" ON "projects" ("isPublished")`);
    await queryRunner.query(`CREATE INDEX "IDX_projects_order" ON "projects" ("order")`);
    await queryRunner.query(`CREATE INDEX "IDX_contacts_isRead" ON "contacts" ("isRead")`);
    await queryRunner.query(`CREATE INDEX "IDX_contacts_createdAt" ON "contacts" ("createdAt")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_projects_authorId"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_contacts_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_contacts_isRead"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_order"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_isPublished"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_authorId"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}