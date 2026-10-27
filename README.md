# 🌌 CoSpace — Sistema de Reservas de Coworking por Horas

Plataforma moderna, robusta y fullstack para la reserva bajo demanda de espacios de coworking (escritorios flexibles, salas de juntas y cabinas de enfoque). Desarrollada con **Next.js 16 (App Router)**, **TypeScript**, **Prisma ORM**, **Supabase (PostgreSQL)** y estilizada con la identidad visual inmersiva **Dreamy Aurora & Stardust**.

---

## 📋 Tabla de Contenidos
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Reglas de Negocio Implementadas](#-reglas-de-negocio-implementadas)
- [Requisitos Previos](#-requisitos-previos)
- [Variables de Entorno](#-variables-de-entorno)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Credenciales de Prueba (Seed)](#-credenciales-de-prueba-seed)
- [Ejecución con Docker](#-ejecución-con-docker)
- [Scripts del Proyecto](#-scripts-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Despliegue](#-despliegue)

---

## 🚀 Descripción del Proyecto

CoSpace resuelve de extremo a extremo la reserva por horas de espacios físicos de coworking con cálculo de tarifas en tiempo real del lado del servidor, prevención de sobreventa y solapamientos mediante transacciones atómicas, autenticación basada en JWT con Refresh Tokens hasheados en base de datos y cookies `httpOnly`, y un diseño visual reactivo con soporte bilingüe (Español / Inglés).

---

## ✨ Características Principales

- **Identidad Visual "Dreamy Aurora & Stardust":** Fondo animado de auroras boreales en bucle continuo, tarjetas con glassmorphism cósmico (`.aurora-glass-card`) y navbar con barrido cinemático de polvo de estrellas.
- **Soporte Multilingüe (i18n):** Contexto React y diccionario bilingüe (ES / EN) en tiempo real para todos los módulos de la aplicación.
- **Estrategias Híbridas de Renderizado:**
  - `Landing Page (/)`: Static Site Generation (SSG) de alto rendimiento.
  - `Catálogo (/spaces)` y `Detalle (/spaces/[id])`: Server-Side Rendering (SSR) dinámico con consulta directa a Prisma.
  - `Dashboard (/dashboard)` y `Admin (/admin)`: Client-Side Rendering (CSR) con manejo de estados, optimistic UI y feedback inmediato.
- **Seguridad en Cookies y Tokens:**
  - Access Token (15 minutos) y Refresh Token (7 días) almacenados únicamente en cookies `httpOnly`, `sameSite: 'lax'` y `secure: isProd`.
  - Refresh Tokens guardados con hash de `bcrypt` en PostgreSQL para permitir revocación inmediata de sesiones.
- **Protección de Rutas:** Middleware / Proxy nativo de Next.js 16 (`src/proxy.ts`) que protege `/dashboard` y `/admin` con validación de roles (`USER` y `ADMIN`).
- **Hidratación 100% Segura:** Componente `FormattedDate` con comprobación de montaje para prevenir mismatch de fechas entre cliente y servidor.

---

## 🛡️ Reglas de Negocio Implementadas

1. **Duración:** Bloques exactos entre 1 y 4 horas completas (ej: 09:00 a 11:00).
2. **Horario Comercial:** Reservas exclusivamente entre las 7:00 y las 21:00.
3. **Horizonte de Tiempo:** No se permite reservar en el pasado ni con más de 30 días de anticipación.
4. **Solapamiento por Espacio:** No se permite doble reserva de un mismo espacio en un mismo horario (fórmula matemática de intervalo semiabierto).
5. **Solapamiento por Usuario:** Un usuario no puede tener dos reservas simultáneas en espacios distintos.
6. **Límite de Reservas:** Máximo 3 reservas futuras confirmadas por usuario.
7. **Espacios Inactivos:** Imposible reservar un espacio desactivado por el administrador.
8. **Cálculo de Precios:** Calculado estrictamente por el servidor (`pricePerHour * horas`).
9. **Políticas de Cancelación:** Los usuarios regulares solo pueden cancelar con un mínimo de 2 horas de anticipación a la hora de inicio. Los administradores pueden cancelar en cualquier momento.
10. **Borrado Lógico:** Las reservas canceladas pasan a estado `CANCELLED` y se preservan en la base de datos para auditoría.
11. **Desactivación de Espacios:** No se puede desactivar un espacio que tenga reservas futuras confirmadas (HTTP 409 Conflict).

---

## 🔧 Requisitos Previos

- **Node.js:** Versión `>= 20.18.0` (recomendado Node 20 o 22 LTS).
- **npm:** Versión `>= 10.0.0`.
- **PostgreSQL / Supabase:** Instancia activa de base de datos PostgreSQL.
- **Docker & Docker Compose** (Opcional, para ejecución contenerizada).

---

## 🔐 Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | Cadena de conexión directa a PostgreSQL (puerto 5432) | `postgresql://postgres:pass@db.ref.supabase.co:5432/postgres` |
| `JWT_ACCESS_SECRET` | Clave secreta para firmar Access Tokens (mínimo 32 caracteres) | `cospace_super_secret_access_jwt_key_2026` |
| `JWT_REFRESH_SECRET` | Clave secreta para firmar Refresh Tokens (mínimo 32 caracteres) | `cospace_super_secret_refresh_jwt_key_2026` |
| `ACCESS_TOKEN_EXPIRES_IN` | Tiempo de vida del Access Token | `"15m"` |
| `REFRESH_TOKEN_EXPIRES_IN` | Tiempo de vida del Refresh Token | `"7d"` |

> **Generar secretos JWT aleatorios en Node.js:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 📦 Instalación y Puesta en Marcha

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/tu-usuario/cospace.git
cd cospace
npm install
```

### 2. Generar el Cliente de Prisma
```bash
npx prisma generate
```

### 3. Sincronizar Esquema con la Base de Datos
```bash
npx prisma db push
```

### 4. Ejecutar el Seed de Datos Iniciales
Crea el usuario Administrador y los 3 espacios de coworking de prueba:
```bash
npm run db:seed
# o directamente: npx prisma db seed
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 👤 Credenciales de Prueba (Seed)

El script de inicialización (`prisma/seed.ts`) crea automáticamente las credenciales maestras:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@cospace.com` | `Admin1234!` |
| **Usuario Regular** | Crea uno desde `/register` | La que elijas (mínimo 6 caracteres) |

---

## 🐳 Ejecución con Docker

El proyecto incluye un `Dockerfile` multi-stage optimizado que genera una imagen ligera de producción basada en Alpine Linux:

### Construir la Imagen
```bash
docker build -t cospace-app .
```

### Ejecutar el Contenedor
```bash
docker run -p 3000:3000 --env-file .env cospace-app
```

Accede a [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts del Proyecto

| Comando | Función |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con Turbopack |
| `npm run build` | Compila y optimiza la aplicación para producción |
| `npm run start` | Arranca el servidor compilado de producción |
| `npm run lint` | Ejecuta el análisis estático de código con ESLint |
| `npm run db:seed` | Ejecuta el seed para sembrar la base de datos |
| `npx tsc --noEmit` | Verifica tipos TypeScript sin emitir archivos |

---

## 📂 Estructura del Proyecto

```text
cospace/
├── prisma/
│   ├── schema.prisma            # Esquema y modelos relacionales de datos
│   └── seed.ts                  # Script de siembra inicial (Admin y Espacios)
├── public/                      # Archivos estáticos públicos
├── src/
│   ├── app/
│   │   ├── (admin)/             # Grupo de rutas administrativas
│   │   │   ├── admin/page.tsx   # Panel de control de espacios
│   │   │   └── layout.tsx       # Layout con barra de administración
│   │   ├── (auth)/              # Grupo de rutas de autenticación
│   │   │   ├── login/page.tsx   # Inicio de sesión con redirección por rol
│   │   │   ├── register/page.tsx# Registro público de usuarios
│   │   │   └── layout.tsx       # Layout con tarjeta glassmorphism
│   │   ├── (private)/           # Grupo de rutas privadas
│   │   │   ├── dashboard/page.tsx# Panel del usuario y cancelación de reservas
│   │   │   └── layout.tsx       # Layout privado con Navbar y Footer
│   │   ├── (public)/            # Grupo de rutas públicas
│   │   │   ├── spaces/          # Catálogo general (SSR)
│   │   │   │   ├── [id]/        # Detalle del espacio y formulario de reserva
│   │   │   │   └── page.tsx     # Listado de espacios activos
│   │   │   ├── layout.tsx       # Layout público principal
│   │   │   └── page.tsx         # Landing page estática (SSG)
│   │   ├── api/                 # Endpoints RESTful
│   │   │   ├── auth/            # /login, /register, /refresh, /logout
│   │   │   ├── bookings/        # GET, POST y PATCH por ID
│   │   │   └── spaces/          # GET, POST y PATCH por ID
│   │   ├── globals.css          # Tailwind CSS y keyframes de auroras/polvo de estrellas
│   │   └── layout.tsx           # Root Layout global con Providers y AuroraBackground
│   ├── components/
│   │   ├── AuroraBackground.tsx # Fondo reactivo animado
│   │   ├── Footer.tsx           # Pie de página compartido
│   │   ├── FormattedDate.tsx    # Componente seguro contra hydration mismatch
│   │   ├── Navbar.tsx           # Barra de navegación con barrido de estrellas e i18n
│   │   └── Providers.tsx        # Contenedor de contextos cliente
│   ├── context/
│   │   └── LanguageContext.tsx  # Contexto React de internacionalización
│   ├── lib/
│   │   ├── auth.ts              # Utilidades criptográficas JWT y cookies seguras
│   │   ├── get-user-session.ts  # Extractor de sesión en Route Handlers
│   │   ├── i18n.ts              # Diccionario bilingüe (ES / EN)
│   │   └── prisma.ts            # Instancia singleton del cliente de Prisma
│   └── proxy.ts                 # Proxy / Middleware nativo de Next.js 16
├── Dockerfile                   # Construcción multi-stage de producción
├── next.config.ts               # Configuración de Next.js y dominios de imágenes
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración de TypeScript
└── README.md                    # Documentación principal
```

---

## 🌐 Despliegue

La plataforma está optimizada para desplegarse con un solo clic en **Vercel**:

- **URL de Producción en Vercel:** `https://cospace-aurora.vercel.app` *(o tu URL asignada tras conectar el repositorio)*
- Recuerda configurar las variables de entorno en el panel de Vercel (**Settings > Environment Variables**):
  - `DATABASE_URL`
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `ACCESS_TOKEN_EXPIRES_IN`
  - `REFRESH_TOKEN_EXPIRES_IN`

---

Desarrollado con dedicación técnica y enfoque en calidad de software por el equipo de CoSpace.
