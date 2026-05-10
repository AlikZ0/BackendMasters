# Implementation plan

This document is a candid map of **what's built**, **what's stubbed**, and
**what to build next** to turn this foundation into the full vision (an
interactive backend academy on the level of Codecademy / LeetCode / Frontend
Masters).

---

## Phase 0 — Foundation (this repo) ✅

Already in this repository:

- Monorepo (pnpm workspaces) with `apps/web`, `apps/api`, `packages/shared`
- Dockerized stack (Postgres, Redis, Adminer, API, Web, Nginx)
- Fastify + Prisma + Zod-validated env + JWT auth (access + refresh rotation)
- Schema for users, gamification, course graph, submissions, certificates
- Mobile-first Next.js 15 frontend with dark glass UI, Framer Motion, Zustand,
  Monaco editor, PWA manifest
- Pages: landing, login, register, dashboard, roadmap, courses, lesson view
  (READING / QUIZ / CODE / PROJECT / INTERVIEW), playground, leaderboard
- Seed script with the **5-level roadmap skeleton** (Beginner → Expert) and
  example lessons of every kind

## Phase 1 — Hardening (1-2 weeks)

- [ ] Add ESLint + Prettier configs across the workspace.
- [ ] Add Vitest + supertest for the API (auth flow, progress flow).
- [ ] Add Playwright e2e for the web app (login → complete a lesson).
- [ ] Tighten Helmet/security headers on Fastify (`@fastify/helmet`).
- [ ] Wire **Sentry** in both apps.
- [ ] Add `pino-http` requestId correlation, structured logging.
- [ ] Add `fastify-metrics` (`/metrics`) and a Prometheus + Grafana compose
      profile.

## Phase 2 — Real code execution (sandbox runner) 🛡️

Today `/runner/run` is a non-executing demo. Replace with a sandboxed worker:

- **Architecture**: API drops a job onto a BullMQ queue (Redis-backed).
  Workers are isolated containers (Docker `--network=none`,
  `--read-only`, `--memory=128m`, `--pids-limit=64`, no host mounts) that
  spawn `node --no-warnings` to run user code with stdin/stdout captured.
- **Time budget**: 5 s wall clock; kill on overrun.
- **Static guardrails**: AST-deny `child_process`, `fs`, `net`, `dns`,
  `worker_threads`, dynamic `import()`.
- For more isolation, run workers under **gVisor** (`runsc`) or
  **Firecracker** microVMs.

## Phase 3 — Course content (the moat)

- Author the full lesson set per level (markdown + quizzes + code tasks).
- Add `Project` model: starter repo URL, rubric, automated tests.
- Add an "interview simulator" mode: timed questions, AI feedback (Phase 5).
- Author senior topics: clean architecture, SOLID, design patterns, scaling,
  caches, queues, CAP, replication, sharding, security, OWASP.

## Phase 4 — Realtime + queues

- Add **BullMQ** for: code execution, email sending, certificate generation.
- Add `/ws/notifications` WebSocket channel (Redis pub/sub) for live XP toasts,
  achievement unlocks, leaderboard rank changes.
- Add a "live cohorts" feature: shared whiteboard for system-design exercises.

## Phase 5 — AI mentor

- New module `apps/api/src/modules/ai/`.
- Integrate an LLM (OpenAI / Anthropic / local) for:
  - Code review on submissions (diff + rubric prompt)
  - Bug explanations
  - Interview simulator scoring
  - Adaptive lesson recommendations
- Token budgets per user; cache prompts in Redis.

## Phase 6 — Gamification, analytics, social

- Achievements engine: subscribe to domain events (LessonCompleted,
  StreakIncremented, ProjectShipped) and unlock badges in a transaction.
- Daily challenge feature.
- Friends, follow, and shareable profile pages (`/u/:username`).
- Email digests (weekly streak, new lessons).
- Stripe billing for "Pro" plan (private projects, AI mentor quota).

## Phase 7 — Scale

- Postgres: read replicas + pgBouncer for connection pooling.
- Redis: cluster mode + separate instance for queues.
- Move `apps/api` to multiple workers behind the LB; sticky sessions only for
  WebSockets.
- CDN for `apps/web` static assets (Vercel handles this; on K8s, use Cloudflare).
- Move file uploads to S3 (or R2) with signed URLs.

---

## Where the foundation will need editing as you grow

| Concern        | Today                          | When you grow                       |
| -------------- | ------------------------------ | ----------------------------------- |
| Email          | Dev tokens returned in JSON    | Provider (Resend / Postmark / SES)  |
| Code runner    | Echo-only stub                 | BullMQ + sandboxed workers          |
| Search         | Postgres `LIKE`                | Meilisearch / Typesense              |
| Analytics      | None                           | PostHog / Plausible                  |
| Image hosting  | None                           | S3 + CDN                             |
| Feature flags  | None                           | Unleash / Flagsmith                  |
| Background jobs| None                           | BullMQ workers + cron               |

---

## Starter prompts for each phase

If you (or another agent) want to implement phases in follow-up sessions, here
are tight, well-scoped tasks:

- "Add Vitest + supertest to `apps/api`, write tests for `/auth/register`,
  `/auth/login`, `/auth/refresh`, and `/progress/complete`."
- "Replace the `/runner/run` stub with a BullMQ-backed sandboxed worker. Run
  user code in a `--network=none --read-only` Docker container with a 5 s wall
  clock and capture stdout/stderr."
- "Add SMTP support behind a feature flag. When enabled, send a real email on
  password reset and email verification using Nodemailer + Resend."
- "Author 30 lessons for Level 2 — Junior Backend, covering Fastify routing,
  validation, middleware, error handling, REST design, and Prisma CRUD."
