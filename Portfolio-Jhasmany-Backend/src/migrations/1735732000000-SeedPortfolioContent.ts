import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPortfolioContent1735732000000 implements MigrationInterface {
  name = 'SeedPortfolioContent1735732000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "projects"
      SET
        "title" = 'Portfolio Jhasmany',
        "description" = 'Portfolio full stack con Next.js, NestJS, PostgreSQL y panel administrativo para gestionar contenido.',
        "shortDescription" = 'Portfolio personal con API, dashboard y despliegue Docker.',
        "content" = 'Aplicacion de portfolio conectada a base de datos, con autenticacion, administracion de proyectos, servicios, skills, newsletter y formularios.',
        "technologies" = 'Next.js,NestJS,PostgreSQL,TypeScript,Docker',
        "imageUrl" = '/portfolio-assets/projects/portfolio-dashboard.png',
        "cover" = '/portfolio-assets/projects/portfolio-dashboard.png',
        "demoUrl" = 'http://localhost',
        "livePreview" = 'http://localhost',
        "githubUrl" = 'https://github.com/jhasmany/portfolio',
        "githubLink" = 'https://github.com/jhasmany/portfolio',
        "showLivePreviewInPortfolio" = true,
        "showGithubInPortfolio" = true,
        "updatedAt" = now()
      WHERE "title" = 'Portfolio Website'
    `);

    await queryRunner.query(`
      INSERT INTO "projects" (
        "title", "description", "shortDescription", "content", "technologies",
        "imageUrl", "cover", "demoUrl", "livePreview", "githubUrl", "githubLink",
        "isPublished", "order", "priority", "type", "showLivePreviewInPortfolio",
        "showGithubInPortfolio", "createdAt", "updatedAt", "authorId"
      )
      SELECT
        'Gym Management App',
        'Sistema web para gestion de gimnasio, clientes, membresias y operaciones internas.',
        'Dashboard para administrar operaciones de gimnasio.',
        'Aplicacion orientada a gestion operativa con panel visual, datos de clientes y flujos administrativos.',
        'React,Next.js,TypeScript,Dashboard',
        '/portfolio-assets/projects/gym.png',
        '/portfolio-assets/projects/gym.png',
        null,
        null,
        null,
        null,
        true,
        2,
        2,
        'Web App',
        false,
        false,
        now(),
        now(),
        u.id
      FROM "users" u
      WHERE u.email = 'jhasmany.fernandez.dev@gmail.com'
        AND NOT EXISTS (SELECT 1 FROM "projects" p WHERE p."title" = 'Gym Management App')
      LIMIT 1
    `);

    await queryRunner.query(`
      INSERT INTO "home_sections" (
        "greeting", "roles", "description", "imageUrl",
        "primaryButtonText", "primaryButtonUrl", "secondaryButtonText", "secondaryButtonUrl",
        "isActive", "createdAt", "updatedAt", "authorId"
      )
      SELECT
        'Hi - I''m Jhasmany Fernandez',
        'FULLSTACK DEVELOPER,TECH SUPPORT,SOFTWARE DEVELOPER',
        'Desarrollo soluciones web modernas, APIs y sistemas administrativos con enfoque practico y escalable.',
        '/portfolio-assets/hero/jhasmany.png',
        'Acceso Personal',
        '/auth/login',
        'Newsletter Clientes',
        '/newsletter/subscribe',
        true,
        now(),
        now(),
        u.id
      FROM "users" u
      WHERE u.email = 'jhasmany.fernandez.dev@gmail.com'
        AND NOT EXISTS (SELECT 1 FROM "home_sections" h WHERE h."isActive" = true)
      LIMIT 1
    `);

    await queryRunner.query(`
      INSERT INTO "services" (
        "title", "shortDescription", "icon", "imageUrl", "technologies", "experienceLevel",
        "clientsServed", "projectsCompleted", "ratings", "order", "isPublished",
        "showDemoInPortfolio", "showGithubInPortfolio", "showClientsServedInPortfolio",
        "showProjectsCompletedInPortfolio", "showRatingsInPortfolio", "createdAt", "updatedAt", "authorId"
      )
      SELECT service_data.*
      FROM (
        VALUES
          ('Frontend Development', 'Interfaces modernas, responsivas y cuidadas con React y Next.js.', 'React', '/portfolio-assets/services/frontend.png', 'React,Next.js,TypeScript,Tailwind CSS', 'Avanzado', '20+', '30+', '4.9/5', 1, true, false, false, true, true, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Backend Development', 'APIs seguras, modulares y listas para crecer con NestJS, Node.js y PostgreSQL.', 'API', '/portfolio-assets/services/backend.png', 'NestJS,Node.js,PostgreSQL,TypeORM', 'Avanzado', '15+', '25+', '4.9/5', 2, true, false, false, true, true, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Backoffice & Dashboards', 'Paneles administrativos para gestionar datos, usuarios, contenido y operaciones.', 'Panel', '/portfolio-assets/services/backoffice.png', 'Next.js,NestJS,PostgreSQL,Auth', 'Avanzado', '10+', '18+', '4.8/5', 3, true, false, false, true, true, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Soporte Tecnico', 'Diagnostico, mantenimiento y soporte para equipos, sistemas y usuarios finales.', 'Support', '/portfolio-assets/services/helpdesk.jpg', 'Helpdesk,Windows,Networking,Hardware', 'Avanzado', '50+', '100+', '4.9/5', 4, true, false, false, true, true, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Seguridad Informatica', 'Buenas practicas, hardening basico y revision de riesgos en aplicaciones y entornos.', 'Security', '/portfolio-assets/services/security.png', 'Security,Audits,Hardening,Monitoring', 'Intermedio', '8+', '12+', '4.8/5', 5, true, false, false, true, true, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('DevOps & Deployments', 'Contenedores, despliegues y automatizacion para entornos de desarrollo y produccion.', 'Deploy', '/portfolio-assets/services/devops-loop.webp', 'Docker,CI/CD,Linux,Nginx', 'Intermedio', '10+', '16+', '4.8/5', 6, true, false, false, true, true, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1))
      ) AS service_data(
        "title", "shortDescription", "icon", "imageUrl", "technologies", "experienceLevel",
        "clientsServed", "projectsCompleted", "ratings", "order", "isPublished",
        "showDemoInPortfolio", "showGithubInPortfolio", "showClientsServedInPortfolio",
        "showProjectsCompletedInPortfolio", "showRatingsInPortfolio", "createdAt", "updatedAt", "authorId"
      )
      WHERE NOT EXISTS (SELECT 1 FROM "services" s WHERE s."title" = service_data."title")
    `);

    await queryRunner.query(`
      INSERT INTO "skills" ("name", "icon", "imageUrl", "order", "isPublished", "createdAt", "updatedAt", "authorId")
      SELECT skill_data.*
      FROM (
        VALUES
          ('JavaScript', 'JS', '/portfolio-assets/skills/javascript.svg', 1, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('TypeScript', 'TS', '/portfolio-assets/skills/typescript.svg', 2, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('React', 'React', '/portfolio-assets/skills/react.svg', 3, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Next.js', 'Next.js', '/portfolio-assets/skills/nextjs.svg', 4, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Node.js', 'Node.js', '/portfolio-assets/skills/nodejs.svg', 5, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('NestJS', 'NestJS', '/portfolio-assets/skills/nest.svg', 6, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Express', 'Express', '/portfolio-assets/skills/express.svg', 7, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1)),
          ('Socket.io', 'Socket.io', '/portfolio-assets/skills/socket.svg', 8, true, now(), now(), (SELECT id FROM "users" WHERE email = 'jhasmany.fernandez.dev@gmail.com' LIMIT 1))
      ) AS skill_data("name", "icon", "imageUrl", "order", "isPublished", "createdAt", "updatedAt", "authorId")
      WHERE NOT EXISTS (SELECT 1 FROM "skills" s WHERE s."name" = skill_data."name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "skills" WHERE "imageUrl" LIKE '/portfolio-assets/skills/%'`);
    await queryRunner.query(`DELETE FROM "services" WHERE "imageUrl" LIKE '/portfolio-assets/services/%'`);
    await queryRunner.query(`DELETE FROM "home_sections" WHERE "imageUrl" = '/portfolio-assets/hero/jhasmany.png'`);
    await queryRunner.query(`DELETE FROM "projects" WHERE "title" = 'Gym Management App'`);
  }
}
