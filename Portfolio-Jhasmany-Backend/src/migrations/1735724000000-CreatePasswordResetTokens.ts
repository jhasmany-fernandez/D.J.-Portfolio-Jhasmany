import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetTokens1735724000000 implements MigrationInterface {
  name = 'CreatePasswordResetTokens1735724000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "password_reset_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying(64) NOT NULL,
        "userId" uuid NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "isUsed" boolean NOT NULL DEFAULT false,
        "ipAddress" inet,
        "userAgent" character varying(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_password_reset_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_password_reset_tokens_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_tokens_userId" ON "password_reset_tokens" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_tokens_token" ON "password_reset_tokens" ("token")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_tokens_expiresAt" ON "password_reset_tokens" ("expiresAt")
    `);

    await queryRunner.query(`
      ALTER TABLE "password_reset_tokens"
      ADD CONSTRAINT "FK_password_reset_tokens_userId"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "FK_password_reset_tokens_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_password_reset_tokens_expiresAt"`);
    await queryRunner.query(`DROP INDEX "IDX_password_reset_tokens_token"`);
    await queryRunner.query(`DROP INDEX "IDX_password_reset_tokens_userId"`);
    await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
  }
}