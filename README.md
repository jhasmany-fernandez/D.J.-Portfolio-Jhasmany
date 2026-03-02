# Portfolio Jhasmany Fernández - Full Stack Application

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)

Portfolio personal de desarrollador Full Stack con Next.js 15, NestJS, TypeScript y PostgreSQL.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración](#-configuración)
- [Desarrollo](#-desarrollo)
- [Scripts Disponibles](#-scripts-disponibles)
- [Características](#-características)

---

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 15.1.7** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework CSS utility-first
- **Zod** - Validación de esquemas
- **Ky** - Cliente HTTP

### Backend
- **NestJS 10** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL 15** - Base de datos relacional
- **JWT** - Autenticación
- **Nodemailer** - Envío de emails
- **Swagger** - Documentación API

---

## ⚡ Inicio Rápido

### Prerrequisitos

- **Node.js 20+** ([Descargar](https://nodejs.org/))
- **PostgreSQL 15+** ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/))

### Instalación

#### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd D.J.-Portfolio-Jhasmany
```

#### 2. Configurar PostgreSQL

Opción A: Instalar PostgreSQL localmente (Windows/Mac/Linux)

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE portfolio_db;
\q
```

Opción B: Usar PostgreSQL en Docker (recomendado)

```bash
docker run -d \
  --name portfolio-postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=portfolio_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=Postgres2307*** \
  -v portfolio_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

#### 3. Configurar Backend

```bash
cd Portfolio-Jhasmany-Backend

# Instalar dependencias
npm install

# El archivo .env ya está creado con la configuración necesaria
# Editar si necesitas cambiar credenciales de BD o email

# Ejecutar migraciones
npm run typeorm migration:run

# Iniciar en modo desarrollo
npm run start:dev
```

El backend estará corriendo en `http://localhost:3001`

#### 4. Configurar Frontend

```bash
cd Portfolio-Jhasmany-Frontend

# Instalar dependencias
npm install

# El archivo .env.local ya está creado
# Iniciar en modo desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:3000`

---

## 📂 Estructura del Proyecto

```
D.J.-Portfolio-Jhasmany/
├── Portfolio-Jhasmany-Backend/      # API NestJS
│   ├── src/
│   │   ├── auth/                    # Autenticación JWT
│   │   ├── users/                   # Gestión de usuarios
│   │   ├── projects/                # CRUD de proyectos
│   │   ├── contact/                 # Formulario de contacto
│   │   ├── newsletter/              # Sistema de newsletter
│   │   ├── common/                  # Utilidades compartidas
│   │   └── migrations/              # Migraciones de BD
│   ├── .env                         # Variables de entorno
│   └── package.json
│
├── Portfolio-Jhasmany-Frontend/     # App Next.js
│   ├── src/
│   │   ├── app/                     # App Router
│   │   ├── components/              # Componentes React
│   │   ├── lib/                     # Utilidades
│   │   ├── services/                # Servicios API
│   │   └── schemas/                 # Validaciones Zod
│   ├── .env.local                   # Variables de entorno
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔧 Configuración

### Variables de Entorno - Backend

Archivo: `Portfolio-Jhasmany-Backend/.env`

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=portfolio_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (opcional para desarrollo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password

# URLs
FRONTEND_URL=http://localhost:3000
```

### Variables de Entorno - Frontend

Archivo: `Portfolio-Jhasmany-Frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1
```

---

## 💻 Desarrollo

### Iniciar Desarrollo

Terminal 1 - Backend:
```bash
cd Portfolio-Jhasmany-Backend
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd Portfolio-Jhasmany-Frontend
npm run dev
```

### URLs Locales

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3000 | Aplicación Next.js |
| Backend API | http://localhost:3001 | API REST |
| Swagger Docs | http://localhost:3001/api/docs | Documentación API |

---

## 📜 Scripts Disponibles

### Backend (NestJS)

```bash
npm run start:dev      # Desarrollo con watch mode
npm run build          # Compilar TypeScript
npm run start          # Modo producción
npm run lint           # Ejecutar ESLint
npm run test           # Ejecutar tests
npm run typeorm        # CLI TypeORM
```

### Frontend (Next.js)

```bash
npm run dev            # Desarrollo con Turbopack
npm run build          # Build optimizado
npm run start          # Servidor producción
npm run lint           # Ejecutar ESLint
```

---

## ✨ Características

### Backend

- Autenticación JWT con sistema de login/registro
- Sistema de reset de contraseñas por email
- Sistema de newsletter con confirmación
- Protección contra ataques con rate limiting
- Sistema de login attempts (3 intentos, bloqueo 15 min)
- CORS configurado
- Documentación Swagger automática
- Validación de datos con class-validator
- Migraciones automáticas de base de datos
- Sistema de contacto por email
- Gestión de proyectos CRUD completo

### Frontend

- Responsive design
- Dark/Light theme
- SEO optimizado
- Performance optimizado
- Formulario de contacto funcional
- Animaciones suaves
- PWA ready

---

## 🗄️ Base de Datos

### Usuario Administrador por Defecto

El sistema se inicializa automáticamente con un usuario administrador:

- **Email:** `jhasmany.fernandez.dev@gmail.com`
- **Contraseña:** `Dev2307***`
- **Rol:** `admin`

### Tablas Creadas

- `users` - Usuarios del sistema
- `projects` - Proyectos del portfolio
- `contacts` - Mensajes de contacto
- `newsletter_subscriptions` - Suscripciones al newsletter
- `password_reset_tokens` - Tokens para reset de contraseñas
- `login_attempts` - Registro de intentos de login

### Conectar a la Base de Datos

```bash
# CLI
psql -U postgres -d portfolio_db

# Herramientas GUI (DBeaver, pgAdmin, DataGrip)
Host: localhost
Port: 5432
Database: portfolio_db
User: postgres
Password: tu_contraseña
```

---

## 🔐 API Endpoints

### Autenticación

```
POST /api/auth/login              # Iniciar sesión
POST /api/auth/register           # Registrarse
POST /api/auth/forgot-password    # Solicitar reset
POST /api/auth/reset-password     # Restablecer contraseña
GET  /api/auth/me                 # Obtener perfil
```

### Proyectos

```
GET    /api/projects              # Listar proyectos
POST   /api/projects              # Crear proyecto (auth)
GET    /api/projects/:id          # Obtener proyecto
PUT    /api/projects/:id          # Actualizar (auth)
DELETE /api/projects/:id          # Eliminar (auth)
```

### Newsletter

```
POST /api/newsletter/subscribe    # Suscribirse
GET  /api/newsletter/confirm      # Confirmar suscripción
POST /api/newsletter/unsubscribe  # Darse de baja
```

### Contacto

```
POST /api/contact                 # Enviar mensaje
```

Ver documentación completa en: `http://localhost:3001/api/docs`

---

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
# Windows:
services.msc -> PostgreSQL

# Linux/Mac:
sudo service postgresql status

# Docker:
docker ps -f name=postgres
```

### Puerto ya en uso

```bash
# Windows - ver qué usa el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Terminar proceso
taskkill /PID <PID> /F
```

### Errores de migración

```bash
cd Portfolio-Jhasmany-Backend
npm run typeorm migration:revert  # Revertir última
npm run typeorm migration:run     # Ejecutar todas
```

---

## 📚 Documentación Adicional

- [Backend README](Portfolio-Jhasmany-Backend/README.md) - Documentación detallada del backend
- [Frontend README](Portfolio-Jhasmany-Frontend/README.md) - Documentación del frontend
- [Swagger API Docs](http://localhost:3001/api/docs) - Documentación interactiva de la API

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Jhasmany Fernández**

- Email: jhasmany.fernandez.dev@gmail.com
- GitHub: [Tu GitHub]
- LinkedIn: [Tu LinkedIn]

---

Desarrollado con ❤️ por Jhasmany Fernández
