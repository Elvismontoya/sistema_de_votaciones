# sistema_de_votaciones
API RESTful para gestionar votantes, candidatos, votos y estadísticas.

**Stack:** Node.js · Express · PostgreSQL (Supabase)

## Requisitos

- Node.js 18 o superior
- Una base de datos PostgreSQL (este proyecto usa Supabase)

## Instalación

```bash
git clone https://github.com/Elvismontoya/sistema_de_votaciones.git
cd sistema_de_votaciones
npm install
```

Crea el archivo `.env` a partir del ejemplo y completa tus datos:

```bash
cp .env.example .env
```

```
PORT=3000
DB_HOST=aws-0-xxxx.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.tuidproyecto
DB_PASSWORD=tu_contraseña
DB_NAME=postgres
DB_SSL=true
JWT_SECRET=un_secreto_seguro
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@votos.com
ADMIN_PASSWORD=admin123
```

> Si usas Supabase, toma los datos de la sección **Session pooler** (Connect → Session pooler), no la conexión directa.

Crea las tablas y arranca:

```bash
npm run migrate      # crea las tablas
npm run seed         # (opcional) datos de ejemplo
npm run dev          # arranca el servidor
```

Servidor en `http://localhost:3000` · Documentación en `http://localhost:3000/api-docs`

## Endpoints

**Votantes**
- `POST /voters` — registrar votante *(requiere token)*
- `GET /voters` — listar votantes
- `GET /voters/:id` — obtener votante
- `DELETE /voters/:id` — eliminar votante *(requiere token)*

**Candidatos**
- `POST /candidates` — registrar candidato *(requiere token)*
- `GET /candidates` — listar candidatos
- `GET /candidates/:id` — obtener candidato
- `DELETE /candidates/:id` — eliminar candidato *(requiere token)*

**Votos**
- `POST /votes` — emitir un voto
- `GET /votes` — listar votos
- `GET /votes/statistics` — estadísticas de la votación

**Autenticación**
- `POST /auth/login` — obtener token JWT

## Cómo probarlo

La forma más fácil es desde Swagger en `http://localhost:3000/api-docs`:

1. Haz login en `POST /auth/login` con las credenciales de admin del `.env`.
2. Copia el token, pulsa **Authorize** y pégalo.
3. Crea candidatos y votantes.
4. Emite votos con `POST /votes`.
5. Consulta `GET /votes/statistics`.

## Reglas principales

- Un votante no puede ser candidato y viceversa.
- Cada votante puede emitir un único voto.
- Al votar se actualiza automáticamente el estado del votante y el conteo del candidato.

## Estadisticas

JSON de las estadisticas

{
  "status": "success",
  "data": {
    "total_votes": 3,
    "total_voters_voted": 3,
    "results": [
      {
        "candidate_id": 1,
        "name": "Maria Gaviria",
        "party": "Partido Verde",
        "votes": 2,
        "percentage": 66.67
      },
      {
        "candidate_id": 2,
        "name": "Carlos Ruiz",
        "party": "Partido Liberal",
        "votes": 1,
        "percentage": 33.33
      }
    ]
  }
}