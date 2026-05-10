# Deployment guide

This guide covers deploying BackendMasters to a single Linux VPS or to a small
Kubernetes cluster. The included `docker-compose.yml` is production-shaped but
intentionally simple — for serious traffic, swap individual pieces (managed
Postgres, managed Redis, container orchestrator, CDN) as you grow.

---

## 1. VPS deploy (single node, Docker Compose)

**Target**: any modern Linux box with Docker 24+ and `docker compose` v2.

### Steps

1. **Provision a VPS** (Ubuntu 22.04 LTS, 2 vCPU / 2 GB RAM minimum for the
   stack to be comfy).
2. Install Docker:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER && newgrp docker
   ```
3. **Clone this repo and configure**:
   ```bash
   git clone <your-fork> backendmasters && cd backendmasters
   cp .env.example .env
   ```
4. **Edit `.env`** and rotate secrets:
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (use `openssl rand -base64 48`)
   - `POSTGRES_PASSWORD`
   - `CORS_ORIGIN=https://your-domain.com`
   - `NEXT_PUBLIC_API_URL=https://your-domain.com/api`
   - `NEXT_PUBLIC_WS_URL=wss://your-domain.com/ws`
5. **Boot the stack**:
   ```bash
   docker compose up -d --build
   docker compose exec api node --import tsx/esm prisma/seed.ts
   ```
6. **HTTPS**: in front of Nginx (the container in this repo serves plain HTTP),
   add **Caddy** or **Traefik** on the host as the TLS terminator. Example
   `Caddyfile`:
   ```caddy
   your-domain.com {
     reverse_proxy localhost:8080
   }
   ```
7. **Firewall**: only expose 80/443 publicly. Postgres (5432), Redis (6379),
   Adminer (8081), and the API (4000) should not be reachable from the internet.
   Either `ufw` or remove their port mappings from `docker-compose.yml` and
   talk to them only over the compose network.

### Backups

Postgres data lives in the `postgres_data` named volume. Take logical dumps:

```bash
docker compose exec -T postgres \
  pg_dump -U bm backendmasters \
  | gzip > "backup-$(date +%F).sql.gz"
```

Restore:

```bash
gunzip -c backup-2026-05-10.sql.gz | \
  docker compose exec -T postgres psql -U bm -d backendmasters
```

---

## 2. Cloud / managed services (recommended once you have users)

Replace local containers with managed services:

| Local service | Cloud equivalent                                  |
| ------------- | ------------------------------------------------- |
| postgres      | Neon / Supabase / RDS / Cloud SQL                 |
| redis         | Upstash / Elasticache / Memorystore               |
| api           | Fly.io / Railway / Render / ECS / Cloud Run       |
| web           | Vercel / Netlify / Cloud Run                      |
| nginx         | platform-managed L7 LB (or keep a Caddy front)    |
| adminer       | replace with **Beekeeper Studio** locally          |

Just point `DATABASE_URL` and `REDIS_URL` at the managed endpoints and ship.

---

## 3. Kubernetes (sketch)

A complete Helm chart is intentionally not included — most teams will write
their own. The minimum manifests you need:

- `Deployment` for `api` (replicas: 2-3), `Service`, `HorizontalPodAutoscaler`
- `Deployment` for `web` (replicas: 2), `Service`
- `Ingress` (NGINX or Traefik) with TLS via cert-manager
- `Secret` for env vars, `ConfigMap` for non-secret config
- Run a one-shot `Job` for `prisma migrate deploy` per release

For a starting point, generate manifests with `kompose convert` from the
`docker-compose.yml` and harden from there.

---

## 4. CI/CD recipe (GitHub Actions, sketch)

```yaml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile=false
      - run: pnpm --filter @bm/api exec prisma generate
      - run: pnpm typecheck
      - run: pnpm build
```

Add a deploy job that builds Docker images, pushes to a registry, and
`ssh`-deploys to your VPS (or triggers a rolling restart in your orchestrator).

---

## 5. Health & observability checklist

- `GET /health` is wired in the API — point your uptime monitor here.
- API logs through pino; in prod, ship to Loki / Datadog / Better Stack.
- Add `pino-http` `requestId` correlation when you scale to multiple workers.
- Add Prometheus metrics with `fastify-metrics` if you want SLOs.
- Sentry: drop the SDK into both `apps/api/src/server.ts` and `apps/web/src/app/layout.tsx`.

---

## 6. Common ops gotchas

- The API container runs `prisma migrate deploy` at start. If the DB is
  unreachable, the container will exit — check `docker compose logs api`.
- If you change the schema, generate a new migration locally with
  `pnpm db:migrate --name <change>` and commit the `prisma/migrations` folder.
- The Next.js Docker image uses `output: "standalone"`. If you change
  `next.config.mjs`, rebuild the web image.
- The Adminer container is intended for **dev only** — remove it from
  `docker-compose.yml` (or guard it behind basic auth) for any public deploy.
