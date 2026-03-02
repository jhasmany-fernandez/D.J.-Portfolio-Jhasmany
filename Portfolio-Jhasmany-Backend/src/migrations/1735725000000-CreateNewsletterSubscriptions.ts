import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewsletterSubscriptions1735725000000 implements MigrationInterface {
  name = 'CreateNewsletterSubscriptions1735725000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "newsletter_subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "firstName" character varying(100),
        "lastName" character varying(100),
        "company" character varying(100),
        "isActive" boolean NOT NULL DEFAULT true,
        "isConfirmed" boolean NOT NULL DEFAULT false,
        "confirmationToken" character varying(64),
        "unsubscribeToken" character varying(64),
        "ipAddress" inet,
        "userAgent" character varying(255),
        "source" character varying(50),
        "confirmedAt" TIMESTAMP,
        "lastEmailSentAt" TIMESTAMP,
        "emailsSentCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_newsletter_subscriptions_email" UNIQUE ("email"),
        CONSTRAINT "PK_newsletter_subscriptions_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_newsletter_subscriptions_email" ON "newsletter_subscriptions" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_newsletter_subscriptions_isActive" ON "newsletter_subscriptions" ("isActive")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_newsletter_subscriptions_isConfirmed" ON "newsletter_subscriptions" ("isConfirmed")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_newsletter_subscriptions_confirmationToken" ON "newsletter_subscriptions" ("confirmationToken")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_newsletter_subscriptions_unsubscribeToken" ON "newsletter_subscriptions" ("unsubscribeToken")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_newsletter_subscriptions_source" ON "newsletter_subscriptions" ("source")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_newsletter_subscriptions_createdAt" ON "newsletter_subscriptions" ("createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_newsletter_subscriptions_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_newsletter_subscriptions_source"`);
    await queryRunner.query(`DROP INDEX "IDX_newsletter_subscriptions_unsubscribeToken"`);
    await queryRunner.query(`DROP INDEX "IDX_newsletter_subscriptions_confirmationToken"`);
    await queryRunner.query(`DROP INDEX "IDX_newsletter_subscriptions_isConfirmed"`);
    await queryRunner.query(`DROP INDEX "IDX_newsletter_subscriptions_isActive"`);
    await queryRunner.query(`DROP INDEX "IDX_newsletter_subscriptions_email"`);
    await queryRunner.query(`DROP TABLE "newsletter_subscriptions"`);
  }
}