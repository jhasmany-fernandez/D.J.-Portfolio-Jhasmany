import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSpanishContent1735735100000 implements MigrationInterface {
  name = 'SeedSpanishContent1735735100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "home_sections"
      SET
        "greetingEs" = COALESCE("greetingEs", 'Hola, soy Jhasmany Fernandez'),
        "rolesEs" = COALESCE("rolesEs", 'DESARROLLADOR SOFTWARE,DESARROLLADOR BACKEND,DESARROLLADOR FRONTEND,ENTUSIASTA DEVOPS,ESTUDIANTE DE HACKING ETICO'),
        "descriptionEs" = COALESCE("descriptionEs", 'Construyo aplicaciones web, APIs y sistemas administrativos. Tengo experiencia en desarrollo backend, frontend, bases de datos, Docker y despliegue de aplicaciones. Actualmente estoy ampliando mis habilidades en desarrollo movil, ciberseguridad y hacking etico.'),
        "primaryButtonText" = 'View Projects',
        "primaryButtonTextEs" = 'Ver Proyectos',
        "primaryButtonUrl" = '/#projects',
        "secondaryButtonText" = 'Request Service',
        "secondaryButtonTextEs" = 'Solicitar Servicio',
        "secondaryButtonUrl" = '/#services'
    `);

    await queryRunner.query(`
      UPDATE "projects"
      SET
        "titleEs" = COALESCE("titleEs", 'Portfolio Jhasmany'),
        "shortDescriptionEs" = COALESCE("shortDescriptionEs", 'Este es mi sitio web de portfolio personal. Muestra mi perfil como desarrollador de software, las tecnologias que uso, mis proyectos y mis habilidades tecnicas. Trabajo principalmente con desarrollo web, APIs, bases de datos, Docker, Linux y despliegue de aplicaciones. Tambien tengo conocimientos en soporte tecnico, DevOps, desarrollo movil, ciberseguridad y hacking etico. El sitio incluye un dashboard administrativo que me permite actualizar proyectos, tecnologias, servicios, imagenes y otros contenidos del portfolio.')
      WHERE "title" = 'Portfolio Jhasmany'
    `);

    await queryRunner.query(`
      UPDATE "projects"
      SET
        "titleEs" = COALESCE("titleEs", 'Gestion de Gimnasio'),
        "shortDescriptionEs" = COALESCE("shortDescriptionEs", 'Gym es una aplicacion web para administrar operaciones de gimnasio. Ayuda a gestionar miembros, membresias, pagos, asistencia e informacion de entrenamiento desde un solo sistema. Desarrolle y desplegue la aplicacion usando Laravel, PostgreSQL, Docker, Nginx y HTTPS, aplicando conocimientos de backend, bases de datos, interfaces web, contenedores y despliegue en servidor.')
      WHERE "title" = 'Gym Management'
    `);

    await queryRunner.query(`UPDATE "services" SET "titleEs" = COALESCE("titleEs", 'Desarrollo Frontend'), "shortDescriptionEs" = COALESCE("shortDescriptionEs", "shortDescription") WHERE "title" = 'Frontend Development'`);
    await queryRunner.query(`UPDATE "services" SET "titleEs" = COALESCE("titleEs", 'Desarrollo Backend'), "shortDescriptionEs" = COALESCE("shortDescriptionEs", "shortDescription") WHERE "title" = 'Backend Development'`);
    await queryRunner.query(`UPDATE "services" SET "titleEs" = COALESCE("titleEs", 'Backoffice y Dashboards'), "shortDescriptionEs" = COALESCE("shortDescriptionEs", "shortDescription") WHERE "title" = 'Backoffice & Dashboards'`);
    await queryRunner.query(`UPDATE "services" SET "titleEs" = COALESCE("titleEs", "title"), "shortDescriptionEs" = COALESCE("shortDescriptionEs", "shortDescription") WHERE "titleEs" IS NULL OR "shortDescriptionEs" IS NULL`);

    await queryRunner.query(`
      UPDATE "services_section"
      SET "subtitleEs" = COALESCE("subtitleEs", 'Ofrezco servicios enfocados en crear soluciones web modernas, seguras y listas para crecer.')
    `);

    await queryRunner.query(`
      UPDATE "testimonials_section"
      SET "subtitleEs" = COALESCE("subtitleEs", 'Conoce la experiencia de clientes y personas que trabajaron conmigo.')
    `);
  }

  public async down(): Promise<void> {
    return Promise.resolve();
  }
}
