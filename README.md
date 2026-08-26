# Learning Tracker

A full-stack personal knowledge base for capturing the developer concepts, commands, and tools learned each day.

## Features

- Register, log in, and log out with a secure HTTP-only cookie session
- Create, view, edit, and delete private learning entries
- Organise entries with per-user, colour-coded categories
- Search titles, notes, and code snippets
- Filter by category, start date, and end date
- Responsive Vue 3 and Bootstrap 5 interface
- PostgreSQL persistence through Prisma

## Structure

```text
.
├── vue-project/   Vue 3 + Vite frontend
├── server/        Express + Prisma REST API
└── render.yaml    Render backend blueprint
```

## Local setup

Requirements: Node.js 20.19+ and PostgreSQL.

### API

```bash
cd server
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Update `server/.env` with your PostgreSQL connection string and a long random `JWT_SECRET`.

### Web app

```bash
cd vue-project
cp .env.example .env
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and expects the API at `http://localhost:3000/api` by default.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Start a session |
| POST | `/api/auth/logout` | End a session |
| GET | `/api/auth/me` | Restore the current session |
| GET/POST | `/api/categories` | List or create categories |
| PUT/DELETE | `/api/categories/:id` | Update or delete a category |
| GET/POST | `/api/entries` | Search/list or create entries |
| GET/PUT/DELETE | `/api/entries/:id` | View, update, or delete an entry |

`GET /api/entries` accepts `search`, `categoryId`, `from`, and `to` query parameters.

## Deployment

1. Create a Neon PostgreSQL database and copy its pooled connection string.
2. Deploy the API to Render using `render.yaml`. Set `DATABASE_URL` and `CLIENT_URL`.
3. Deploy `vue-project` to Vercel and set `VITE_API_URL` to the Render URL ending in `/api`.
4. Set Render's `CLIENT_URL` to the final Vercel origin, without a trailing slash. Multiple allowed origins can be comma-separated.

Both production services must use HTTPS because authentication uses a cross-site secure cookie.
