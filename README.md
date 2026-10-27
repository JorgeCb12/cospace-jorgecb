# CoSpace

Plataforma web fullstack para la reserva de espacios de coworking por horas.

CoSpace permite a los usuarios explorar un catálogo de escritorios, salas de juntas y cabinas, crear y cancelar reservas, y gestionar su historial. Los administradores pueden crear, editar y desactivar espacios desde un panel dedicado.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v22 o superior
- npm v11 o superior
- Cuenta en [Supabase](https://supabase.com/) (base de datos PostgreSQL)
- [Docker](https://www.docker.com/) _(opcional, para ejecución en contenedor)_

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto tomando como base el `.env.example`:

| Variable                      | Descripción                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                | Cadena de conexión de Supabase vía **Transaction Pooler** (puerto `6543`). Añadir `?pgbouncer=true&connection_limit=1`. |
| `DIRECT_URL`                  | Cadena de conexión directa vía **Session Pooler** (puerto `5432`). Usada por Prisma para migraciones.                   |
| `BETTER_AUTH_SECRET`          | Secreto para Better Auth. Genera uno con `npx @better-auth/cli secret`.                                                 |
| `BETTER_AUTH_URL`             | URL base de la aplicación (ej. `http://localhost:3000`).                                                                |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | La misma URL base (expuesta al cliente).                                                                                |

---

## Ejecución en desarrollo

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/JorgeCb12/cospace-jorgecb.git
cd cospace-jorgecb
npm install
```

### 2. Configurar variables de entorno

Crea el archivo `.env` y completa los valores según la tabla anterior.

### 3. Ejecutar migraciones

```bash
npx prisma migrate dev
```

### 4. Ejecutar el seed

```bash
npx prisma db seed
```

### 5. Levantar el servidor

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

#### Credenciales de administrador (seed)

| Campo    | Valor               |
| -------- | ------------------- |
| Email    | `admin@cospace.com` |
| Password | `Admin123!`         |

---

## Ejecución con Docker

### 1. Construir la imagen

```bash
docker build -t cospace-app .
```

### 2. Correr el contenedor

```bash
docker run -p 3000:3000 --env-file .env cospace-app
```

### 3. Ejecución con Docker Compose (Alternativa)

Si tienes Docker Compose instalado y el proyecto cuenta con la configuración correspondiente (`docker-compose.yml`), puedes construir la imagen y levantar los servicios con:

```bash
docker-compose up --build
```

---

## Scripts disponibles

| Script          | Descripción                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo.      |
| `npm run build` | Compila la aplicación para producción. |
| `npm run start` | Inicia el servidor en modo producción. |
| `npm run lint`  | Ejecuta ESLint.                        |

---

## Estructura del proyecto

```text
cospace/
├── app/
│   ├── (auth)/          # Rutas de autenticación (login, registro)
│   ├── (public)/        # Rutas públicas (catálogo, detalle de espacio)
│   ├── (private)/       # Rutas privadas (mis reservas)
│   ├── (admin)/         # Panel de administración
│   └── api/             # API Routes de Next.js
├── components/          # Componentes de React reutilizables (ui, layout, forms)
├── docs/                # Documentación técnica (REGLAS.md, API.md)
├── hooks/               # Custom Hooks de React (use-auth-guard)
├── lib/                 # Configuraciones (Prisma, Better Auth, i18n, validaciones)
├── services/            # Lógica de negocio pura (validaciones de reservas y espacios)
├── prisma/              # Esquema de BD, migraciones y seed
└── types/               # Interfaces y tipos de TypeScript
```

---

## URL de la aplicación desplegada

https://cospace-jorgecb.vercel.app
