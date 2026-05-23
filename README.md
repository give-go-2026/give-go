# Give & Go

## Prerequisites

- **Docker**

## Getting started

Fill in `apps/web/.env` with your `NEON_API_KEY` and `NEON_PROJECT_ID`, then:

```bash
git clone https://github.com/hrustinszkiadam/give-n-go.git
cd give-n-go

docker compose up -d
```

App runs at `http://localhost:3000`.

## Schema changes

Run this after pulling changes that include schema updates, or after writing new ones:

```bash
docker compose exec web bun --filter web run db:push
```

## Production

Deployed automatically via Vercel on push to `main`.

Schema migrations against prod are manual and intentional — swap in the prod `DATABASE_URL` locally and run:

```bash
bun --filter web run db:push
```
