import type { Track } from "./types";

export const LEVEL_5: Track = {
  id: "l5-senior",
  level: "SENIOR",
  title: "Уровень 5 — Senior Backend",
  description:
    "Тестирование, наблюдаемость, очереди, масштабирование, system design, Kubernetes — то, что отличает middle от senior.",
  hours: 24,
  courses: [
    {
      id: "testing",
      emoji: "🧪",
      title: "Тестирование",
      description: "Unit, integration, e2e, моки, фикстуры.",
      modules: [
        {
          id: "testing-types",
          title: "Виды тестов",
          lessons: [
            {
              id: "test-pyramid",
              kind: "READING",
              title: "Пирамида тестов",
              xp: 12,
              estMin: 8,
              body:
                "# Пирамида тестов\n\n" +
                "```\n         /\\\n        /e2\\           ← мало, медленно, дорого\n       /----\\\n      / int  \\         ← средне\n     /--------\\\n    /   unit   \\       ← много, быстро, дёшево\n   /------------\\\n```\n\n" +
                "## Unit\n\nЧистая функция, без I/O. Должны выполняться **за миллисекунды**. На 1000+ тестов — секунды.\n\n" +
                "## Integration\n\nПроверяют слои вместе: сервис + БД, сервис + Redis. Используют test-database (можно через testcontainers).\n\n" +
                "## E2E\n\nПрогоняют всё приложение через HTTP. Самые медленные, самые хрупкие, но ловят баги, которые ничто другое не словит.\n\n" +
                "## Что считать unit'ом\n\nЕсли у тебя сервис с инжектированной БД — мокаешь БД через интерфейс → это unit. Если запускаешь Postgres в testcontainer'е → это integration.",
            },
            {
              id: "vitest-setup",
              kind: "READING",
              title: "Vitest для Node.js",
              xp: 12,
              estMin: 10,
              body:
                "# Vitest\n\n" +
                "Современный быстрый раннер, совместимый с Jest, но в разы быстрее (esbuild + Vite).\n\n" +
                "## Установка\n\n```bash\nnpm i -D vitest\n```\n\n" +
                "## package.json\n\n```json\n\"scripts\": {\n  \"test\": \"vitest run\",\n  \"test:watch\": \"vitest\",\n  \"test:coverage\": \"vitest run --coverage\"\n}\n```\n\n" +
                "## Первый тест\n\n```ts\nimport { describe, it, expect } from 'vitest';\nimport { add } from './math';\n\ndescribe('add', () => {\n  it('суммирует два числа', () => {\n    expect(add(2, 3)).toBe(5);\n  });\n  it.each([[0, 0, 0], [1, 1, 2]])('add(%d,%d)=%d', (a, b, r) => {\n    expect(add(a, b)).toBe(r);\n  });\n});\n```\n\n" +
                "## Vitest vs Jest\n\nVitest нативно понимает ESM и TS, не требует babel/ts-jest. На больших проектах — кратно быстрее.",
            },
            {
              id: "supertest-api",
              kind: "READING",
              title: "Тесты API: supertest",
              xp: 14,
              estMin: 10,
              body:
                "# Тесты HTTP-эндпоинтов\n\n" +
                "## Подход\n\nНе поднимай реальный сервер на порту. Используй `app.inject()` (Fastify) или `supertest` (Express) — они вызывают handler напрямую.\n\n" +
                "## Fastify\n\n```ts\nimport { build } from './app';\n\nit('GET /health', async () => {\n  const app = await build();\n  const res = await app.inject({ method: 'GET', url: '/health' });\n  expect(res.statusCode).toBe(200);\n  expect(res.json()).toEqual({ ok: true });\n  await app.close();\n});\n```\n\n" +
                "## Тесты с БД\n\nВарианты:\n1. **Testcontainers** — поднимают real Postgres в Docker для тестов. Реалистично, медленнее.\n2. **In-memory SQLite** через Prisma — быстро, но не воспроизводит Postgres-специфичные вещи.\n3. **Транзакция-rollback** — каждый тест внутри транзакции, в конце откат.\n\nДля API на Postgres — testcontainers.",
            },
            {
              id: "mocks",
              kind: "READING",
              title: "Моки, стабы, фикстуры",
              xp: 12,
              estMin: 10,
              body:
                "# Изоляция тестов\n\n" +
                "## Когда мокать\n\n- Внешние API (Stripe, SendGrid) — иначе тест зависит от интернета\n- Время (`Date.now`) — для детерминизма\n- Случайность (`Math.random`)\n\n" +
                "## vi.mock\n\n```ts\nimport { vi } from 'vitest';\n\nvi.mock('./mailer', () => ({\n  send: vi.fn().mockResolvedValue({ id: 'msg_1' }),\n}));\n```\n\n" +
                "## Время\n\n```ts\nimport { vi, beforeEach, afterEach } from 'vitest';\n\nbeforeEach(() => vi.useFakeTimers().setSystemTime(new Date('2025-01-01')));\nafterEach(() => vi.useRealTimers());\n```\n\n" +
                "## Антипаттерн: моки на всё подряд\n\nЕсли у тебя 50 моков на один сервис — ты тестируешь моки, а не сервис. Подумай об архитектуре (DI, hexagonal).",
            },
            {
              id: "test-quiz",
              kind: "QUIZ",
              title: "Тест: тестирование",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Каких тестов в пирамиде должно быть БОЛЬШЕ всего?",
                    options: ["e2e", "integration", "unit", "manual"],
                    correct: "unit",
                  },
                  {
                    q: "Чем тестировать Fastify-приложение без поднятия порта?",
                    options: ["axios", "fetch", "app.inject()", "ngrok"],
                    correct: "app.inject()",
                  },
                  {
                    q: "Как сделать детерминированную дату в тесте?",
                    options: [
                      "удалить Date",
                      "vi.useFakeTimers + setSystemTime",
                      "process.env.DATE",
                      "никак",
                    ],
                    correct: "vi.useFakeTimers + setSystemTime",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "observability",
      emoji: "📡",
      title: "Observability",
      description: "Логи, метрики, трейсинг — без них прод вслепую.",
      modules: [
        {
          id: "obs-three-pillars",
          title: "Три столпа",
          lessons: [
            {
              id: "structured-logs",
              kind: "READING",
              title: "Структурированные логи",
              xp: 14,
              estMin: 10,
              body:
                "# Структурированные логи\n\n" +
                "**Никогда** в проде не пиши `console.log('something happened')`. Используй structured JSON.\n\n" +
                "## Pino — стандарт для Node\n\n```ts\nimport pino from 'pino';\nconst log = pino({ level: 'info' });\n\nlog.info({ userId: 42, durationMs: 120 }, 'request handled');\nlog.error({ err, requestId }, 'payment failed');\n```\n\n" +
                "Вывод (одна строка):\n```json\n{\"level\":30,\"time\":1735603200,\"userId\":42,\"durationMs\":120,\"msg\":\"request handled\"}\n```\n\n" +
                "## Уровни\n\n- `trace` — детальный дебаг\n- `debug` — дебаг в dev\n- `info` — нормальные события\n- `warn` — что-то не так, но обработали\n- `error` — упало\n- `fatal` — приложение умирает\n\nВ проде дефолт `info`, остальное по флагу.\n\n" +
                "## Request ID\n\nКаждый запрос получает уникальный id (X-Request-Id), пробрасывается в логи всех вызовов. В Fastify — встроено.",
            },
            {
              id: "metrics",
              kind: "READING",
              title: "Метрики и Prometheus",
              xp: 14,
              estMin: 10,
              body:
                "# Метрики\n\n" +
                "## RED метод (для сервисов)\n\n- **Rate** — запросов в секунду\n- **Errors** — % ошибок\n- **Duration** — латентность (p50, p95, p99)\n\n## USE метод (для ресурсов)\n\n- **Utilization** — % использования\n- **Saturation** — насколько перегружено\n- **Errors** — ошибки\n\n## Prometheus\n\nServer пуллит метрики с твоего `/metrics`-эндпоинта.\n\n" +
                "```ts\nimport metrics from 'fastify-metrics';\nawait app.register(metrics, { endpoint: '/metrics' });\n```\n\n" +
                "Сразу появятся:\n- `http_request_duration_seconds` (histogram)\n- `http_requests_total{status,method,route}` (counter)\n- `process_resident_memory_bytes`\n\n## Кастомные метрики\n\n```ts\nconst orderCreated = new client.Counter({\n  name: 'orders_created_total',\n  help: 'Total orders',\n  labelNames: ['country'],\n});\norderCreated.inc({ country: 'RU' });\n```\n\n" +
                "Графики строишь в **Grafana**.",
            },
            {
              id: "tracing",
              kind: "READING",
              title: "Distributed tracing (OpenTelemetry)",
              xp: 14,
              estMin: 10,
              body:
                "# Tracing\n\n" +
                "Логи = «что случилось», метрики = «сколько», трейсы = «**где** время потрачено» в распределённом запросе.\n\n" +
                "## Концепции\n\n- **Trace** — весь путь запроса через систему\n- **Span** — кусок работы (HTTP-вызов, SQL-запрос)\n- **Context propagation** — пробрасывание trace_id через сервисы (HTTP-заголовок `traceparent`)\n\n" +
                "## OpenTelemetry в Node\n\n```ts\nimport { NodeSDK } from '@opentelemetry/sdk-node';\nimport { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';\n\nconst sdk = new NodeSDK({\n  serviceName: 'my-api',\n  instrumentations: [getNodeAutoInstrumentations()],\n});\nsdk.start();\n```\n\n" +
                "Auto-instrumentations подключат HTTP, Express/Fastify, Prisma, Redis, ioredis — само.\n\n" +
                "## Куда отправлять\n\n- **Jaeger**, **Tempo** (open source)\n- **Datadog**, **Honeycomb**, **Grafana Cloud** (managed)\n\n## Когда видишь силу\n\nЗапрос идёт user → api → auth-service → db → cache → queue → worker. Один трейс показывает: 80% времени потрачено в worker'е на медленный SQL. Без трейсинга ты бы искал часами.",
            },
            {
              id: "correlation",
              kind: "READING",
              title: "Корреляция логов и трейсов",
              xp: 12,
              estMin: 8,
              body:
                "# Корреляция\n\n" +
                "Зачем: ты увидел ошибку в логах. Хочешь понять — это часть какого запроса, что было до, что после.\n\n" +
                "## Решение\n\nВсе логи **одного** запроса несут один и тот же `trace_id`.\n\n" +
                "## Fastify\n\n```ts\nconst app = Fastify({\n  genReqId: () => crypto.randomUUID(),\n  logger: { level: 'info' },\n});\n```\n\n" +
                "Все `req.log.*` автоматически содержат `reqId`. Этот `reqId` сохраняешь в OpenTelemetry-контексте, и все ваши SQL-логи и API-вызовы тоже его получат.\n\n" +
                "## Между сервисами\n\nПробрасывай через заголовок:\n```ts\nfetch(url, { headers: { 'x-request-id': req.id, 'traceparent': otelContext } });\n```\n\nКакая-то middleware принимает и продолжает контекст.",
            },
            {
              id: "grafana",
              kind: "READING",
              title: "Grafana дашборды",
              xp: 10,
              estMin: 7,
              body:
                "# Grafana\n\n" +
                "GUI для всех ваших данных: метрики из Prometheus, логи из Loki, трейсы из Tempo/Jaeger.\n\n" +
                "## Базовый дашборд для API\n\n1. **RPS** (rate) по эндпоинтам\n2. **Error rate** (% ответов >= 500)\n3. **Latency p50/p95/p99**\n4. **CPU и RAM** контейнеров\n5. **Top slow queries** из БД\n6. **Active WebSocket connections**\n\n" +
                "## Алерты\n\nГрафана умеет триггерить алерты в Slack/Pager:\n- p95 latency > 500ms за 5 минут\n- error_rate > 1% за 5 минут\n- memory > 90% за 10 минут\n\nНе ставь алерты на CPU 100% единичным пиком — спам. Ставь на устойчивые проблемы.",
            },
          ],
        },
      ],
    },
    {
      id: "queues",
      emoji: "📬",
      title: "Очереди и события",
      description: "Фоновые задачи, BullMQ, event-driven, идемпотентность.",
      modules: [
        {
          id: "background-jobs",
          title: "Фоновые задачи",
          lessons: [
            {
              id: "why-queues",
              kind: "READING",
              title: "Зачем очереди",
              xp: 12,
              estMin: 8,
              body:
                "# Зачем очереди\n\n" +
                "Сценарий: пользователь отправил форму регистрации. Что нужно сделать?\n\n" +
                "1. Создать запись в БД\n2. Отправить welcome email\n3. Сгенерировать аватар\n4. Зарегистрировать в маркетинговой CRM\n5. Залогировать аналитику\n\nЕсли всё это в HTTP-обработчике — пользователь ждёт 5 секунд. Если SendGrid лежит — регистрация падает.\n\n" +
                "## Решение: очередь\n\n1. HTTP-обработчик: создал юзера, кинул задачу в очередь, вернул 201 за 50ms.\n2. Worker (отдельный процесс) забирает задачи и выполняет асинхронно. Если упало — ретраит.\n\n" +
                "## Что писать в воркер\n\n- Email-нотификации\n- Генерация PDF\n- Импорт/экспорт больших данных\n- Обработка изображений\n- Вебхуки в третьи системы\n- Регулярные задачи (cron)",
            },
            {
              id: "bullmq",
              kind: "READING",
              title: "BullMQ — стандарт для Node",
              xp: 14,
              estMin: 12,
              body:
                "# BullMQ\n\n" +
                "Очередь поверх Redis Streams. Production-ready, retries, delays, cron, приоритеты.\n\n" +
                "## Producer (наш API)\n\n```ts\nimport { Queue } from 'bullmq';\n\nconst emailQueue = new Queue('email', {\n  connection: { host: 'redis', port: 6379 },\n});\n\nawait emailQueue.add('welcome', { userId: 42, email: 'a@b.com' }, {\n  attempts: 5,\n  backoff: { type: 'exponential', delay: 5000 },\n  removeOnComplete: { age: 3600 },\n  removeOnFail: { age: 86400 },\n});\n```\n\n" +
                "## Worker (отдельный процесс)\n\n```ts\nimport { Worker } from 'bullmq';\n\nnew Worker('email', async (job) => {\n  await sendEmail(job.data.email, 'welcome');\n}, {\n  connection: { host: 'redis', port: 6379 },\n  concurrency: 10,\n});\n```\n\n" +
                "## Особенности\n\n- **Retries** с экспоненциальной задержкой\n- **Delayed jobs** (`delay: 60_000` — выполнить через минуту)\n- **Repeatable jobs** — встроенный cron (`repeat: { pattern: '0 * * * *' }`)\n- **Priorities** — важные задачи вперёд\n- **Bull Board** — веб-UI для мониторинга",
            },
            {
              id: "event-driven",
              kind: "READING",
              title: "Event-driven архитектура",
              xp: 14,
              estMin: 10,
              body:
                "# Event-driven\n\n" +
                "Вместо «User Service вызвал Email Service» — `User Service` публикует событие `user.registered`, любой подписчик может на него отреагировать.\n\n" +
                "## Два паттерна\n\n**Pub/Sub** (Redis, Kafka):\n```\npublisher → channel → many subscribers\n```\n\n**Event log** (Kafka, Redis Streams):\n```\nproducer → log → consumers с offset'ами\n```\n\n" +
                "## Преимущества\n\n- **Слабая связанность** — User Service не знает про Email Service\n- **Асинхронность** — публикуешь и идёшь дальше\n- **Расширяемость** — новый подписчик не требует изменения publisher'а\n\n" +
                "## Цена\n\n- Сложнее дебажить (где этот event пройдёт?)\n- Нужна eventual consistency в голове\n- Идемпотентность обязательна\n\n" +
                "## Когда брать\n\nКогда несколько сервисов реагируют на одно действие, и они не нуждаются в немедленном ответе.",
            },
            {
              id: "idempotent-jobs",
              kind: "READING",
              title: "Идемпотентность джоб",
              xp: 14,
              estMin: 10,
              body:
                "# Идемпотентность\n\n" +
                "Любая фоновая задача может выполниться **дважды**:\n- сетевой таймаут — worker не получил подтверждение\n- worker упал между «выполнил» и «удалил из очереди»\n- кто-то запустил миграцию задач\n\n" +
                "## Решение 1: Idempotency key\n\n```ts\nawait emailQueue.add('welcome', data, { jobId: `welcome:${userId}` });\n```\n\nBullMQ не примет вторую задачу с тем же jobId.\n\n" +
                "## Решение 2: атомарный чек на стороне worker'а\n\n```ts\nawait db.$transaction(async (tx) => {\n  const log = await tx.notificationLog.findUnique({ where: { jobKey } });\n  if (log) return; // уже отправляли\n  await sendEmail(...);\n  await tx.notificationLog.create({ data: { jobKey } });\n});\n```\n\n" +
                "## Главное правило\n\n**Каждая задача должна быть безопасной к повторному запуску.** Это контракт.",
            },
            {
              id: "bullmq-project",
              kind: "PROJECT",
              title: "Проект: воркер на BullMQ",
              xp: 100,
              estMin: 50,
              body:
                "# Проект: notification service\n\n" +
                "## Сценарий\n\nAPI (Fastify) принимает `POST /notify { userId, type }`. Кладёт в очередь. Worker отправляет в консоль (имитация SMTP/Telegram), задерживает 1-3с случайно, иногда падает (10%) для теста ретраев.\n\n" +
                "## Требования\n\n- BullMQ + Redis в Docker Compose\n- Producer и worker — два отдельных процесса\n- Retries: 5 попыток, exponential backoff\n- Idempotency через jobId\n- Bull Board UI на /admin/queues\n- Логи через pino\n\n" +
                "## Бонус\n\n- Repeat job: каждый день в 9:00 — daily digest\n- Метрики: количество обработанных, упавших задач",
            },
          ],
        },
      ],
    },
    {
      id: "scaling",
      emoji: "📈",
      title: "Масштабирование",
      description: "Vertical, horizontal, stateless, кэш-уровни, балансировщики.",
      modules: [
        {
          id: "scale-strategies",
          title: "Стратегии",
          lessons: [
            {
              id: "vertical-horizontal",
              kind: "READING",
              title: "Vertical vs horizontal",
              xp: 12,
              estMin: 8,
              body:
                "# Scale up vs Scale out\n\n" +
                "## Вертикальное (scale up)\n\nБольше CPU/RAM на одной машине. Проще, но есть потолок и одна точка отказа.\n\n" +
                "**Плюсы:** не нужно переписывать код, нет проблем с consistency.\n**Минусы:** дорого, лимит, downtime при апгрейде.\n\n" +
                "## Горизонтальное (scale out)\n\nДобавляешь больше **одинаковых** машин/контейнеров за балансировщиком.\n\n" +
                "**Плюсы:** дёшево, бесконечно (почти), HA.\n**Минусы:** требует **stateless** сервиса, общая БД/кэш = новый bottleneck.\n\n" +
                "## Реальный путь\n\n1. Scale up до разумного железа\n2. Когда упёрся — scale out\n3. Когда БД упёрлась — read replicas → шардинг → CQRS\n\nНе начинай с микросервисов с первого дня. Это путь в ад.",
            },
            {
              id: "stateless",
              kind: "READING",
              title: "Stateless сервисы",
              xp: 12,
              estMin: 8,
              body:
                "# Stateless\n\n" +
                "Stateless = инстанс не хранит состояние между запросами. Любой запрос может пойти на любой инстанс.\n\n" +
                "## Что НЕ должно быть в памяти процесса\n\n- Сессии пользователей → Redis\n- Кэш данных, привязанный к юзеру → Redis\n- Загруженные файлы → S3 (или общий volume)\n- Состояние JWT-блэклиста → Redis\n- Счётчики → Redis (`INCR`)\n\n" +
                "## Сложные кейсы\n\n**WebSocket** — подключение по своей природе stateful. Решения:\n- Sticky sessions на LB (один user → один pod)\n- Redis pub/sub: pod публикует в канал, все подписанные pod'ы рассылают своим клиентам (fanout)\n\n**File upload (chunked)** — части файла должны идти на одну ноду. Sticky session или upload в S3 напрямую с pre-signed URL.",
            },
            {
              id: "load-balancers",
              kind: "READING",
              title: "Балансировщики",
              xp: 12,
              estMin: 8,
              body:
                "# Load balancers\n\n" +
                "## L4 vs L7\n\n- **L4** (TCP/UDP) — Nginx stream, HAProxy, AWS NLB. Очень быстрый, не понимает HTTP.\n- **L7** (HTTP) — Nginx, HAProxy, Traefik, Envoy, AWS ALB. Может маршрутизировать по path/header, делать SSL termination, retry.\n\n" +
                "## Алгоритмы\n\n- **Round-robin** — по очереди\n- **Least connections** — на самый свободный\n- **IP hash** — один client → один backend (sticky)\n- **Random** — да, иногда лучшее\n\n" +
                "## Health checks\n\nLB периодически дёргает `/health` каждого backend'а. Падает — выводит из ротации. Поднялся — возвращает.\n\n" +
                "## Graceful shutdown\n\nКогда деплоишь:\n1. K8s/LB снимает pod из ротации\n2. Pod получает SIGTERM\n3. Приложение **доканчивает текущие запросы** (30 сек)\n4. Pod останавливается\n\nВ Node:\n```ts\nprocess.on('SIGTERM', async () => {\n  await server.close(); // не принимать новые\n  // ждём текущих\n  await db.disconnect();\n  process.exit(0);\n});\n```",
            },
            {
              id: "cache-levels",
              kind: "READING",
              title: "Уровни кэша",
              xp: 14,
              estMin: 10,
              body:
                "# Уровни кэша\n\n" +
                "От ближнего к дальнему:\n\n## 1. Browser cache\n\n`Cache-Control: max-age=...`. Самый быстрый — данных вообще не было запроса.\n\n## 2. CDN edge cache\n\nCloudflare, Fastly. Кэширует статику и иногда API-ответы у пользователя в стране. Снимает нагрузку с origin.\n\n## 3. Reverse proxy cache\n\nNginx умеет кэшировать ответы upstream'а. Полезно для тяжёлых GET'ов.\n\n## 4. Application-level\n\nIn-memory (LRU) внутри процесса. Самый быстрый, но локальный.\n\n```ts\nimport LRU from 'lru-cache';\nconst cache = new LRU({ max: 500, ttl: 60_000 });\n```\n\n## 5. Distributed cache\n\nRedis. Общий между инстансами.\n\n## 6. Database query cache\n\nPostgres сам кэширует план запроса. Иногда — добавь materialized view.\n\n## Стратегия\n\nКэшируй то, что **дорого получить** и **редко меняется**. Главные грабли — invalidation. «There are only two hard things: cache invalidation and naming things.»",
            },
            {
              id: "scaling-quiz",
              kind: "QUIZ",
              title: "Тест: масштабирование",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Что обязательно для horizontal scaling?",
                    options: ["GPU", "stateless сервисы", "монорепо", "GraphQL"],
                    correct: "stateless сервисы",
                  },
                  {
                    q: "L7 балансировщик умеет...",
                    options: [
                      "только TCP",
                      "роутить по HTTP-пути и заголовкам",
                      "только UDP",
                      "только SSL",
                    ],
                    correct: "роутить по HTTP-пути и заголовкам",
                  },
                  {
                    q: "Где НЕ должно храниться состояние сессии в горизонтально масштабируемом API?",
                    options: ["Redis", "БД", "память процесса", "JWT"],
                    correct: "память процесса",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "system-design",
      emoji: "🧠",
      title: "System Design",
      description: "CAP, репликация, шардинг, eventual consistency, интервью-кейсы.",
      modules: [
        {
          id: "sd-fundamentals",
          title: "Базовые концепции",
          lessons: [
            {
              id: "cap",
              kind: "READING",
              title: "CAP теорема",
              xp: 12,
              estMin: 8,
              body:
                "# CAP\n\n" +
                "В распределённой системе из трёх — **Consistency**, **Availability**, **Partition tolerance** — можно выбрать только два.\n\n" +
                "## Что значит\n\n- **C** — все ноды видят одно и то же значение\n- **A** — каждый запрос получает ответ (не ошибку)\n- **P** — система продолжает работать при сетевом разрыве\n\n## Реальность\n\nP — обязательна (сети ломаются). Значит выбор между C и A.\n\n- **CP** (Postgres, MongoDB strong) — при разрыве предпочтёт отказать в ответе, чем дать stale данные\n- **AP** (Cassandra, DynamoDB eventually) — продолжит отвечать, но возможно устаревшим значением\n\n## Eventual consistency\n\nAP-системы дают «в конце концов согласуется». Для лайков и счётчиков просмотров — норма. Для денег — нет.",
            },
            {
              id: "sharding",
              kind: "READING",
              title: "Шардинг",
              xp: 14,
              estMin: 10,
              body:
                "# Шардинг\n\n" +
                "Когда одна БД физически не справляется — данные делят на куски (shards) по ключу.\n\n" +
                "## Стратегии\n\n- **Hash-based** — `shard_id = hash(user_id) % N`. Равномерно, но добавление шарда = пересчёт всего.\n- **Range-based** — пользователи с id 0-1M на shard 0, 1M-2M на shard 1. Простое добавление, но горячие диапазоны.\n- **Geo** — по стране пользователя. Хорошо для locality, плохо для глобальных запросов.\n\n## Consistent hashing\n\nХитрая хеш-функция, при которой добавление ноды переносит лишь 1/N данных. Используют DynamoDB, Cassandra.\n\n## Грабли\n\n- **Cross-shard transactions** очень сложны (2PC, sagas)\n- **JOIN'ы** между шардами — нет, выноси в денормализованные view\n- **Глобальные счётчики** — нужно собирать с шардов и суммировать",
            },
            {
              id: "replication-deep",
              kind: "READING",
              title: "Репликация и consistency",
              xp: 14,
              estMin: 10,
              body:
                "# Репликация\n\n" +
                "## Типы\n\n- **Master-slave (primary-replica)** — писать только на master, реплики только для read\n- **Master-master** — писать на обоих, конфликты надо разруливать\n- **Quorum** — пишем на N из M (Cassandra)\n\n## Read-after-write\n\nПользователь обновил профиль и сразу его читает. Реплика может ещё не получить изменение.\n\n**Решения:**\n1. Свежие чтения — с master\n2. `synchronous_commit = on` — мастер ждёт ack от реплики\n3. Read your writes — прочитал → запомнил версию → читай только с реплики, у которой версия >=\n\n## Consistency levels\n\n- **Strong** — ждём подтверждения от всех\n- **Causal** — гарантия порядка причинно-следственных событий\n- **Eventual** — когда-нибудь согласуется\n\nВыбор зависит от домена. Лента в соцсети — eventual норм. Балансы счетов — strong.",
            },
            {
              id: "design-twitter",
              kind: "INTERVIEW",
              title: "System design: спроектируй Twitter",
              xp: 150,
              estMin: 90,
              body:
                "# System Design Interview: мини-Twitter\n\n" +
                "## Требования\n\n- Пользователи постят твиты (140 символов)\n- Подписки\n- Лента: твиты людей, на которых подписан, в обратном хронопорядке\n- Лайки, ретвиты\n- Поиск по хештегу\n- 200M активных пользователей, 500K твитов в секунду в пике\n\n## Что обсудить\n\n1. **API**: эндпоинты, форматы\n2. **Data model**: users, follows, tweets, likes\n3. **Хранилище**: Postgres (юзеры/фоллоу) + Cassandra (твиты, like-counters) + S3 (медиа)\n4. **Лента — push vs pull**\n   - Pull: при запросе джоиним последние твиты подписок. Просто, но медленно при N подписок.\n   - Push (fan-out): когда A твитнул, кладём в Redis-feed каждого фолловера. Быстро читать, медленно для celebrity (100M фолловеров).\n   - Гибрид: push для обычных, pull для звёзд.\n5. **Кэширование**: hot tweets, профили, ленты в Redis\n6. **Поиск**: Elasticsearch инвертированный индекс по хештегам\n7. **Доставка**: WebSocket для realtime обновлений, fallback на polling\n8. **CDN** для медиа\n9. **Шардинг твитов** по user_id или time-based\n10. **Аналитика**: Kafka → ClickHouse\n\n## Ожидание интервьюера\n\nНе детали, а **ход мысли**. Trade-off'ы. Понимание масштаба.",
            },
          ],
        },
      ],
    },
    {
      id: "kubernetes-cicd",
      emoji: "☸️",
      title: "Kubernetes и CI/CD",
      description: "K8s основы и автоматизация деплоя.",
      modules: [
        {
          id: "k8s-basics",
          title: "Kubernetes",
          lessons: [
            {
              id: "k8s-why",
              kind: "READING",
              title: "Зачем Kubernetes",
              xp: 12,
              estMin: 8,
              body:
                "# Зачем K8s\n\n" +
                "Docker — про **один контейнер**. Compose — про **набор контейнеров на одной ноде**. K8s — про **много контейнеров на многих нодах** с автоматическим:\n\n- расписанием на ноды\n- self-healing (упал pod — поднимется новый)\n- rolling updates (постепенный деплой без даунтайма)\n- horizontal autoscaling (по CPU/RAM/кастомным метрикам)\n- service discovery (имена вместо IP)\n- управлением секретами/конфигами\n\n## Когда нужен\n\n- Много сервисов (5+)\n- Надо HA и автомасштабирование\n- Команда умеет его обслуживать\n\n## Когда НЕ нужен\n\n- 1-3 сервиса — Compose + один VPS, или PaaS (Fly.io, Railway)\n- Маленькая команда без DevOps — пользуйтесь managed-платформами",
            },
            {
              id: "k8s-objects",
              kind: "READING",
              title: "Pod, Deployment, Service",
              xp: 14,
              estMin: 10,
              body:
                "# Базовые объекты\n\n" +
                "## Pod\n\nМинимальная единица. Один или несколько контейнеров с общей сетью и storage. Обычно — один контейнер на pod.\n\n## Deployment\n\nДекларативно описывает **сколько** реплик pod'ов запустить и **как** их обновлять.\n\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers:\n      - name: api\n        image: ghcr.io/me/api:1.0.0\n        ports: [{ containerPort: 4000 }]\n        resources:\n          limits: { memory: 512Mi, cpu: '1' }\n        livenessProbe:\n          httpGet: { path: /health, port: 4000 }\n        readinessProbe:\n          httpGet: { path: /ready, port: 4000 }\n```\n\n" +
                "## Service\n\nСтабильный endpoint для группы pod'ов (они приходят-уходят, IP меняются).\n\n```yaml\nkind: Service\nspec:\n  selector: { app: api }\n  ports: [{ port: 80, targetPort: 4000 }]\n```\n\n## Ingress\n\nL7 роутинг снаружи в кластер. Nginx Ingress, Traefik.",
            },
            {
              id: "k8s-hpa",
              kind: "READING",
              title: "HPA — автомасштабирование",
              xp: 12,
              estMin: 8,
              body:
                "# HorizontalPodAutoscaler\n\n" +
                "```yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata: { name: api-hpa }\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  minReplicas: 3\n  maxReplicas: 30\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target: { type: Utilization, averageUtilization: 70 }\n```\n\n" +
                "Когда CPU всех pod'ов превышает 70% — добавляет реплики, падает — убирает.\n\n## По кастомным метрикам\n\nЧерез Prometheus Adapter — масштабироваться по `requests_per_second`, `queue_depth` итд.\n\n## ConfigMap и Secret\n\nКонфиги и секреты — отдельные ресурсы, монтируются в pod как файлы или env. Никогда не клади в YAML deployment'а.",
            },
            {
              id: "github-actions-ci",
              kind: "READING",
              title: "CI/CD на GitHub Actions",
              xp: 14,
              estMin: 10,
              body:
                "# CI/CD\n\n" +
                "## Минимальный workflow\n\n```yaml\n# .github/workflows/ci.yml\nname: ci\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - uses: actions/setup-node@v4\n      with: { node-version: 20, cache: pnpm }\n    - uses: pnpm/action-setup@v4\n      with: { version: 9 }\n    - run: pnpm install --frozen-lockfile\n    - run: pnpm typecheck\n    - run: pnpm test\n    - run: pnpm build\n```\n\n## Деплой\n\n```yaml\ndeploy:\n  needs: build\n  if: github.ref == 'refs/heads/main'\n  runs-on: ubuntu-latest\n  steps:\n  - uses: docker/build-push-action@v5\n    with:\n      push: true\n      tags: ghcr.io/me/api:${{ github.sha }}\n  - uses: azure/setup-kubectl@v4\n  - run: |\n      kubectl set image deployment/api api=ghcr.io/me/api:${{ github.sha }}\n      kubectl rollout status deployment/api\n```\n\n## Принципы\n\n- Тесты на каждом PR\n- Блок merge при упавшем CI\n- Автоматический деплой на staging при merge в main\n- Ручной gate на prod\n- Rollback в один клик (предыдущий тег)",
            },
            {
              id: "final-project",
              kind: "PROJECT",
              title: "Финальный проект: production stack",
              xp: 200,
              estMin: 240,
              body:
                "# Финальный проект\n\n" +
                "Собери end-to-end production-ready приложение.\n\n" +
                "## Стек\n\n- Fastify + TypeScript + Prisma + Postgres\n- Redis для кэша и BullMQ для воркеров\n- WebSocket-канал для realtime\n- JWT auth с refresh-токенами\n- Zod на всех входах\n- Pino structured logs\n- /health и /metrics\n\n## DevOps\n\n- Multi-stage Dockerfile, образ < 150 MB\n- docker-compose для локалки (api, db, redis, adminer, mailhog)\n- nginx как reverse-proxy с rate-limit\n- Healthcheck'и везде\n- .env.example, без секретов в git\n\n## CI/CD\n\n- GitHub Actions: lint, typecheck, test, build\n- Push образа в GHCR\n- Деплой на VPS (через Caddy + docker compose) или на Fly.io / Railway\n\n## Тесты\n\n- Vitest unit тесты (>50%)\n- Supertest для главных эндпоинтов\n\n## Observability\n\n- Sentry для ошибок\n- Логи в JSON\n- /metrics Prometheus\n\n## Документация\n\n- README с quickstart, схема архитектуры\n- OpenAPI/Swagger спека\n\n## Это твоё CV\n\nЭтот проект на GitHub + ссылка на работающий деплой = ты готов к Senior Backend позиции. Серьёзно.",
            },
          ],
        },
      ],
    },
  ],
};
