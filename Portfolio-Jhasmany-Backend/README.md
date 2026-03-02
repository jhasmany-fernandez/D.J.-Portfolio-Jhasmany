# Portfolio Backend - NestJS API

Backend API para el portfolio de Jhasmany Fernández desarrollado con NestJS, TypeORM y PostgreSQL.

## 🚀 Características

- **Autenticación JWT** con sistema de login/registro
- **Sistema de reset de contraseñas** por email
- **Sistema de newsletter** con confirmación por email
- **Protección contra ataques** con rate limiting y bloqueo de cuentas
- **Sistema de login attempts** (3 intentos, bloqueo por 15 minutos)
- **CORS configurado** para desarrollo y producción
- **Documentación Swagger** automática
- **Validación de datos** con class-validator
- **Migraciones automáticas** de base de datos
- **Sistema de contacto** por email
- **Gestión de proyectos** CRUD completo

## 🏗️ Arquitectura

```
src/
├── auth/                 # Módulo de autenticación
│   ├── dto/             # DTOs para validación
│   ├── entities/        # Entidades de BD
│   ├── guards/          # Guards JWT
│   └── auth.service.ts  # Lógica de autenticación
├── users/               # Módulo de usuarios
├── projects/            # Módulo de proyectos
├── contact/             # Módulo de contacto
├── newsletter/          # Módulo de newsletter
├── common/              # Utilidades compartidas
│   ├── filters/         # Filtros de excepciones
│   ├── interceptors/    # Interceptores
│   └── services/        # Servicios comunes
├── migrations/          # Migraciones de BD
└── main.ts             # Punto de entrada
```

## 🐳 Configuración con Docker

### Variables de Entorno

El backend utiliza las siguientes variables de entorno configuradas en `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=development
  - PORT=3001
  - DB_HOST=postgres
  - DB_PORT=5432
  - DB_USERNAME=postgres
  - DB_PASSWORD=Postgres2307***
  - DB_NAME=portfolio_db
  - JWT_SECRET=your-super-secret-jwt-key-change-in-production
  - JWT_EXPIRES_IN=7d
  - EMAIL_HOST=smtp.gmail.com
  - EMAIL_PORT=587
  - EMAIL_USER=jhasmany.fernandez.dev@gmail.com
  - EMAIL_PASS=dwhx cdax xxne lrwo
  - EMAIL_FROM=jhasmany.fernandez.dev@gmail.com
  - EMAIL_FROM_NAME=Jhasmany Fernandez - Portfolio
  - FRONTEND_URL=http://localhost:3002
```

### Iniciar con Docker

```bash
# Desde el directorio raíz del proyecto
docker compose up -d

# Solo el backend
docker compose up -d backend postgres
```

## 📊 Base de Datos

### Configuración de PostgreSQL

- **Host:** localhost
- **Puerto:** 5434 (mapeado desde el contenedor)
- **Base de datos:** portfolio_db
- **Usuario:** postgres
- **Contraseña:** Postgres2307***

### Conectar con herramientas externas

```bash
# Línea de comandos
docker exec -it $(docker ps -q -f name=postgres) psql -U postgres -d portfolio_db

# Para herramientas GUI (DataGrip, pgAdmin, DBeaver, etc.)
Host: localhost
Port: 5434
Database: portfolio_db
User: postgres
Password: Postgres2307***
```

### Estructura de Tablas

Las migraciones crean automáticamente las siguientes tablas:

- `users` - Usuarios del sistema
- `projects` - Proyectos del portfolio
- `contacts` - Mensajes de contacto
- `newsletter_subscriptions` - Suscripciones al newsletter
- `password_reset_tokens` - Tokens para reset de contraseñas
- `login_attempts` - Registro de intentos de login

## 👤 Usuario Administrador por Defecto

El sistema se inicializa automáticamente con un usuario administrador:

- **Email:** `jhasmany.fernandez.dev@gmail.com`
- **Contraseña:** `Dev2307***`
- **Nombre:** `Jhasmany Fernández`
- **Rol:** `admin`
- **Estado:** Activo

Este usuario se crea automáticamente mediante la migración `SeedAdminUser1735723300000`.

## 🔐 Autenticación y Seguridad

### Sistema de Login Attempts

- **Máximo 3 intentos fallidos** por email/IP
- **Bloqueo por 15 minutos** después de 3 intentos
- **Registro de intentos** con IP, User-Agent y timestamp
- **Limpieza automática** de intentos antiguos

### JWT Configuration

- **Secreto:** Configurable por variable de entorno
- **Expiración:** 7 días por defecto
- **Headers requeridos:** Authorization: Bearer <token>

### Rate Limiting

- **Login:** 5 intentos por 5 minutos
- **Forgot Password:** 3 intentos por 10 minutos
- **Reset Password:** 5 intentos por 5 minutos

## 📧 Sistema de Email

### Configuración SMTP

El sistema utiliza Gmail SMTP para envío de emails:

- **Servidor:** smtp.gmail.com
- **Puerto:** 587
- **Autenticación:** App Password de Gmail
- **Remitente:** jhasmany.fernandez.dev@gmail.com

### Tipos de Email

1. **Password Reset:** Enlaces para restablecer contraseña
2. **Newsletter Confirmation:** Confirmación de suscripción
3. **Contact Form:** Notificaciones de mensajes de contacto

## 🔗 Newsletter System

### Flujo de Suscripción

1. Usuario ingresa email en formulario
2. Sistema genera token único
3. Envía email de confirmación
4. Usuario confirma haciendo clic en enlace
5. Suscripción se activa

### API Endpoints

```
POST /api/newsletter/subscribe    # Suscribirse
GET  /api/newsletter/confirm      # Confirmar suscripción
POST /api/newsletter/unsubscribe  # Darse de baja
```

## 🛡️ CORS Configuration

### Desarrollo

```javascript
origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:8000']
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'Pragma']
credentials: true
```

### Producción

```javascript
origin: ['http://181.114.111.21', 'https://181.114.111.21']
```

## 📝 API Documentation

### Swagger UI

En modo desarrollo, la documentación está disponible en:

```
http://localhost:3001/api/docs
```

### Principales Endpoints

#### Autenticación
```
POST /api/auth/login              # Iniciar sesión
POST /api/auth/register           # Registrarse
POST /api/auth/forgot-password    # Solicitar reset de contraseña
POST /api/auth/reset-password     # Restablecer contraseña
GET  /api/auth/validate-reset-token # Validar token de reset
GET  /api/auth/me                 # Obtener perfil del usuario
```

#### Proyectos
```
GET    /api/projects              # Listar proyectos
POST   /api/projects              # Crear proyecto
GET    /api/projects/:id          # Obtener proyecto
PUT    /api/projects/:id          # Actualizar proyecto
DELETE /api/projects/:id          # Eliminar proyecto
```

#### Contacto
```
POST /api/contact                 # Enviar mensaje de contacto
```

#### Newsletter
```
POST /api/newsletter/subscribe    # Suscribirse
GET  /api/newsletter/confirm      # Confirmar suscripción
POST /api/newsletter/unsubscribe  # Darse de baja
```

## 🛠️ Desarrollo Local

### Requisitos

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (para desarrollo local sin Docker)

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd Portfolio-Jhasmany-Backend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar con Docker
docker compose up -d

# O desarrollo local
npm run start:dev
```

### Scripts Disponibles

```bash
npm run build         # Compilar TypeScript
npm run start         # Iniciar en producción
npm run start:dev     # Iniciar en desarrollo (watch mode)
npm run start:debug   # Iniciar en modo debug
npm run lint          # Ejecutar ESLint
npm run test          # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:cov      # Tests con coverage
npm run test:e2e      # Tests end-to-end
```

## 🔄 Migraciones

### Migraciones Incluidas

1. `InitialMigration1735723200000` - Estructuras básicas de tablas
2. `SeedAdminUser1735723300000` - Usuario administrador y proyecto ejemplo
3. `CreatePasswordResetTokens1735724000000` - Sistema de reset de contraseñas
4. `CreateNewsletterSubscriptions1735725000000` - Sistema de newsletter
5. `CreateLoginAttempts1735728000000` - Sistema de intentos de login

### Ejecutar Migraciones

```bash
# Automáticamente al iniciar el contenedor
docker compose up -d backend

# Manualmente (desarrollo local)
npm run typeorm migration:run
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
docker ps -f name=postgres

# Verificar logs del backend
docker logs $(docker ps -q -f name=backend)
```

#### 2. CORS errors desde el frontend
- Verificar que `NODE_ENV=development` en el backend
- Confirmar que el origen del frontend esté en la lista de CORS

#### 3. Emails no se envían
- Verificar credenciales de Gmail
- Confirmar que el App Password esté correcto
- Revisar logs del backend para errores SMTP

#### 4. Token de reset inválido
- Verificar que el token no haya expirado (1 hora)
- Confirmar que el token no haya sido usado ya
- Verificar conectividad entre frontend y backend

### Logs

```bash
# Ver logs del backend
docker logs -f $(docker ps -q -f name=backend)

# Ver logs de PostgreSQL
docker logs -f $(docker ps -q -f name=postgres)

# Ver todos los logs
docker compose logs -f
```

## 🚀 Despliegue

### Variables de Entorno de Producción

```bash
NODE_ENV=production
JWT_SECRET=<strong-secret-key>
DB_PASSWORD=<secure-password>
EMAIL_PASS=<gmail-app-password>
```

### Consideraciones de Seguridad

1. Cambiar `JWT_SECRET` a un valor seguro
2. Usar contraseñas fuertes para la base de datos
3. Configurar HTTPS en producción
4. Actualizar orígenes CORS para el dominio de producción
5. Configurar rate limiting apropiado
6. Usar variables de entorno para secretos

## 📞 Soporte

Para reportar problemas o solicitar funcionalidades:

- **Email:** jhasmany.fernandez.dev@gmail.com
- **GitHub:** [Repository Issues]
- **Documentación:** [Swagger UI](http://localhost:3001/api/docs)

## 📄 Licencia

Este proyecto es privado y pertenece a Jhasmany Fernández.