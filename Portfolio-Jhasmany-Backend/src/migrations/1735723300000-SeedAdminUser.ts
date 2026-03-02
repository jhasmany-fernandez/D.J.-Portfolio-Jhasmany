import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1735723300000 implements MigrationInterface {
  name = 'SeedAdminUser1735723300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('Dev2307***', 10);

    await queryRunner.query(`
      INSERT INTO "users" ("id", "email", "name", "password", "role", "isActive", "createdAt", "updatedAt")
      VALUES (
        uuid_generate_v4(),
        'jhasmany.fernandez.dev@gmail.com',
        'Jhasmany Fernández',
        '${hashedPassword}',
        'admin',
        true,
        now(),
        now()
      )
      ON CONFLICT ("email") DO NOTHING
    `);

    // Create sample project
    await queryRunner.query(`
      INSERT INTO "projects" (
        "id", "title", "description", "content", "technologies",
        "imageUrl", "demoUrl", "githubUrl", "isPublished", "order",
        "createdAt", "updatedAt", "authorId"
      )
      SELECT
        uuid_generate_v4(),
        'Portfolio Website',
        'A modern portfolio website built with Next.js and NestJS, featuring responsive design and admin panel.',
        'This project showcases modern web development practices using React, TypeScript, and PostgreSQL. It includes user authentication, content management, and a clean, responsive design.',
        'Next.js,NestJS,PostgreSQL,TypeScript,Docker',
        'https://via.placeholder.com/600x400',
        'http://localhost:3002',
        'https://github.com/jhasmany/portfolio',
        true,
        1,
        now(),
        now(),
        u.id
      FROM "users" u WHERE u.email = 'jhasmany.fernandez.dev@gmail.com'
      LIMIT 1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove sample data
    await queryRunner.query(`DELETE FROM "projects" WHERE "title" = 'Portfolio Website'`);
    await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'jhasmany.fernandez.dev@gmail.com'`);
  }
}