import type { Track } from "./types";

export const LEVEL_2: Track = {
  id: "l2-http-apis",
  level: "JUNIOR",
  title: "Уровень 2 — HTTP и API",
  description:
    "Протокол HTTP, REST API, фреймворки Express/Fastify, аутентификация и валидация.",
  hours: 18,
  courses: [
    {
      id: "http-deep",
      emoji: "🌐",
      title: "HTTP с нуля до глубины",
      description: "Методы, статусы, заголовки, CORS, кэширование, HTTPS.",
      modules: [
        {
          id: "http-basics",
          title: "Основы протокола",
          lessons: [
            {
              id: "http-methods",
              kind: "READING",
              title: "Методы и статусы",
              xp: 12,
              estMin: 8,
              body:
                "# HTTP-методы\n\n" +
                "- `GET` — получить, **идемпотентный**, без тела, кешируется\n" +
                "- `POST` — создать, не идемпотентный\n" +
                "- `PUT` — заменить целиком, идемпотентный\n" +
                "- `PATCH` — частичное обновление\n" +
                "- `DELETE` — удалить, идемпотентный\n\n" +
                "## Статусы\n\n" +
                "- `2xx` успех — 200 OK, 201 Created, 204 No Content\n" +
                "- `3xx` редиректы — 301 Permanent, 302 Found, 304 Not Modified\n" +
                "- `4xx` клиент виноват — 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests\n" +
                "- `5xx` сервер виноват — 500 Internal Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout\n\n" +
                "Главное: **401** = «я не знаю, кто ты», **403** = «знаю, но нельзя».",
            },
            {
              id: "http-headers",
              kind: "READING",
              title: "Важные заголовки",
              xp: 10,
              estMin: 8,
              body:
                "# Заголовки, которые ты будешь использовать каждый день\n\n" +
                "## Запрос\n\n" +
                "- `Authorization: Bearer <token>` — JWT\n" +
                "- `Content-Type: application/json` — что в теле\n" +
                "- `Accept: application/json` — что хочу в ответ\n" +
                "- `If-None-Match: <etag>` — кэширование\n\n" +
                "## Ответ\n\n" +
                "- `Content-Type` — тип ответа\n" +
                "- `Cache-Control: max-age=3600, public` — управление кэшем\n" +
                "- `ETag: <hash>` — версия ресурса\n" +
                "- `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Lax`\n" +
                "- `Strict-Transport-Security: max-age=63072000` — обязательный HTTPS\n" +
                "- `Content-Security-Policy: default-src 'self'`\n\n" +
                "## Безопасность одной строкой\n\n" +
                "Используй `helmet` (Express) или `@fastify/helmet` — он расставляет 95% security-заголовков автоматически.",
            },
            {
              id: "cors",
              kind: "READING",
              title: "CORS — что это и как он бесит",
              xp: 12,
              estMin: 8,
              body:
                "# CORS (Cross-Origin Resource Sharing)\n\n" +
                "Браузер по умолчанию **запрещает** JS делать запросы на другой origin (схема + домен + порт). Сервер может разрешить через заголовки.\n\n" +
                "## Простые vs preflighted\n\n" +
                "**Простые** запросы (GET/HEAD/POST с простыми типами) идут сразу. Браузер просто проверяет ответ.\n\n" +
                "**Preflighted** (PUT, DELETE, кастомные заголовки) — браузер сначала шлёт `OPTIONS` с `Access-Control-Request-Method`, и только если сервер ответил OK — отправляет основной запрос.\n\n" +
                "## Что должен ответить сервер\n\n" +
                "```\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST, PATCH, DELETE\nAccess-Control-Allow-Headers: Content-Type, Authorization\nAccess-Control-Allow-Credentials: true\nAccess-Control-Max-Age: 600\n```\n\n" +
                "## Главное правило\n\n" +
                "**Никогда** в проде не ставь `Access-Control-Allow-Origin: *` для эндпоинтов с куками. Это = открытая дверь в пользовательскую сессию.",
            },
            {
              id: "caching",
              kind: "READING",
              title: "Кэширование HTTP",
              xp: 12,
              estMin: 10,
              body:
                "# Кэш — самый дешёвый перфоманс\n\n" +
                "## Cache-Control\n\n" +
                "- `no-store` — не кешировать вообще (ответы с приватными данными)\n" +
                "- `no-cache` — кэшировать, но всегда валидировать (revalidate)\n" +
                "- `public, max-age=3600` — кэшировать всем (CDN тоже) на час\n" +
                "- `private, max-age=600` — только в браузере, не в CDN\n" +
                "- `immutable` — никогда не изменится (хешированные статики)\n\n" +
                "## ETag и If-None-Match\n\n" +
                "Сервер шлёт `ETag: \"abc123\"`. Клиент в следующий раз шлёт `If-None-Match: \"abc123\"`. Если не изменилось — `304 Not Modified` без тела.\n\n" +
                "## Last-Modified и If-Modified-Since\n\nТо же самое, но через дату. ETag предпочтительнее.\n\n" +
                "## Стратегия для API\n\n" +
                "- Эндпоинты с пользовательскими данными: `Cache-Control: no-store`\n" +
                "- Список курсов, статика: `public, max-age=3600`\n" +
                "- Картинки, JS-бандлы: `immutable, max-age=31536000` + хеш в имени файла",
            },
            {
              id: "http-quiz",
              kind: "QUIZ",
              title: "Тест: HTTP",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Какой статус для «не авторизован»?",
                    options: ["400", "401", "403", "404"],
                    correct: "401",
                  },
                  {
                    q: "Идемпотентный метод (можно повторять без эффекта):",
                    options: ["POST", "PUT", "PATCH", "POST с datetime"],
                    correct: "PUT",
                  },
                  {
                    q: "Что такое preflight в CORS?",
                    options: [
                      "OPTIONS-запрос перед основным",
                      "проверка SSL-сертификата",
                      "DNS-резолв",
                      "rate limit",
                    ],
                    correct: "OPTIONS-запрос перед основным",
                  },
                  {
                    q: "Какой заголовок для условного запроса с ETag?",
                    options: ["If-Match", "If-None-Match", "If-Cached", "Cache-Validate"],
                    correct: "If-None-Match",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "frameworks",
      emoji: "⚡",
      title: "Express и Fastify",
      description: "Два главных фреймворка Node.js: где какой и почему.",
      modules: [
        {
          id: "frameworks-compared",
          title: "Сравнение и базовые приложения",
          lessons: [
            {
              id: "express-basics",
              kind: "READING",
              title: "Express основы",
              xp: 12,
              estMin: 10,
              body:
                "# Express — старый знакомый\n\n" +
                "```js\nimport express from \"express\";\nconst app = express();\napp.use(express.json());\n\napp.get(\"/users/:id\", async (req, res) => {\n  const user = await db.user.findById(req.params.id);\n  if (!user) return res.status(404).json({ error: \"not_found\" });\n  res.json(user);\n});\n\napp.listen(3000);\n```\n\n" +
                "## Главные части\n\n" +
                "- **Middleware** — функции `(req, res, next)`, цепочка обработки\n" +
                "- **Router** — группировка маршрутов\n" +
                "- **Error handler** — последний middleware с 4 аргументами `(err, req, res, next)`\n\n" +
                "## Почему его всё ещё пишут\n\nГромадная экосистема, миллион плагинов, все знают. Но он медленнее современных альтернатив и не имеет встроенной валидации.",
            },
            {
              id: "fastify-basics",
              kind: "READING",
              title: "Fastify основы",
              xp: 14,
              estMin: 10,
              body:
                "# Fastify — современный выбор\n\n" +
                "```ts\nimport Fastify from \"fastify\";\nconst app = Fastify({ logger: true });\n\napp.get(\"/users/:id\", async (req, reply) => {\n  const { id } = req.params as { id: string };\n  return db.user.findById(id);\n});\n\nawait app.listen({ port: 3000 });\n```\n\n" +
                "## Чем сильнее Express\n\n" +
                "- В **2-3 раза** быстрее на тяжёлой нагрузке\n" +
                "- Встроенная валидация JSON-Schema (или Zod)\n" +
                "- Сильная система плагинов с инкапсуляцией\n" +
                "- Чисто async/await в обработчиках, без `next`\n" +
                "- Лучшая интеграция с TypeScript из коробки\n\n" +
                "Дефолт для новых проектов в 2025+.",
            },
            {
              id: "middleware",
              kind: "READING",
              title: "Middleware — самый мощный паттерн",
              xp: 12,
              estMin: 10,
              body:
                "# Middleware\n\n" +
                "Middleware — функция, которая работает с запросом до или после обработчика. Она может модифицировать запрос, ответ, или вызывать `next()` чтобы передать дальше.\n\n" +
                "## Express\n\n" +
                "```js\napp.use((req, res, next) => {\n  req.startTime = Date.now();\n  next();\n});\n\napp.use((req, res, next) => {\n  res.on(\"finish\", () => {\n    console.log(`${req.method} ${req.url} ${Date.now() - req.startTime}ms`);\n  });\n  next();\n});\n```\n\n" +
                "## Fastify (hooks)\n\n" +
                "```ts\napp.addHook(\"onRequest\", async (req) => {\n  (req as any).startTime = Date.now();\n});\napp.addHook(\"onResponse\", async (req, reply) => {\n  console.log(reply.elapsedTime, req.url);\n});\n```\n\n" +
                "## Что обычно вешают как middleware\n\n" +
                "- Логирование\n- Аутентификация (JWT)\n- CORS, helmet\n- Rate-limit\n- Парсинг тела\n- Глобальная обработка ошибок",
            },
            {
              id: "errors",
              kind: "READING",
              title: "Обработка ошибок",
              xp: 14,
              estMin: 10,
              body:
                "# Ошибки в Node.js API\n\n" +
                "## Принципы\n\n" +
                "1. **Свой класс ошибок** с HTTP-кодом\n" +
                "2. **Один глобальный handler**\n" +
                "3. **Никогда не показывай stack trace в проде**\n\n" +
                "```ts\nclass HttpError extends Error {\n  constructor(public status: number, public code: string, message: string) {\n    super(message);\n  }\n}\n\nconst NotFound = (msg = \"not found\") => new HttpError(404, \"not_found\", msg);\nconst BadRequest = (msg: string) => new HttpError(400, \"bad_request\", msg);\n\napp.setErrorHandler((err, _req, reply) => {\n  if (err instanceof HttpError) {\n    return reply.status(err.status).send({ error: err.code, message: err.message });\n  }\n  reply.status(500).send({ error: \"internal\", message: \"unexpected\" });\n});\n```\n\n" +
                "## Async-ошибки\n\nВ Express до v5 нужно было оборачивать асинхронные обработчики в `try/catch` или хелпер `asyncHandler`. В Fastify и Express 5 — async ошибки ловятся автоматически.\n\n" +
                "## Никогда не глотай ошибки\n\n`catch (e) {}` — твоя боль через месяц. Минимум — залогировать.",
            },
            {
              id: "router-code",
              kind: "CODE",
              title: "Код: реализуй простой роутер",
              xp: 40,
              estMin: 15,
              body:
                "Сделай мини-роутер, который сопоставляет метод+путь с обработчиком. Должен поддерживать `:param`.",
              payload: {
                starter:
                  "function createRouter() {\n  const routes = [];\n  return {\n    add(method, path, handler) {\n      // твой код: запомнить маршрут\n    },\n    match(method, path) {\n      // твой код: вернуть { handler, params } или null\n    }\n  };\n}\n",
                mustContain: ["function createRouter", "match", "add"],
                hint: "Преобразуй :param в регулярку (\\w+) и сохрани имена параметров.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "rest",
      emoji: "🔁",
      title: "REST API на практике",
      description: "Принципы REST, версионирование, пагинация, идемпотентность.",
      modules: [
        {
          id: "rest-fundamentals",
          title: "Принципы и шаблоны",
          lessons: [
            {
              id: "rest-principles",
              kind: "READING",
              title: "REST принципы",
              xp: 12,
              estMin: 8,
              body:
                "# REST в реальной жизни\n\n" +
                "REST — это **архитектурный стиль**, а не стандарт. На практике для backend-разработчика REST = договорённости о том, как структурировать HTTP API.\n\n" +
                "## Ресурсы и URI\n\n" +
                "- `/users` — коллекция\n" +
                "- `/users/42` — конкретный\n" +
                "- `/users/42/orders` — вложенная коллекция\n" +
                "- `/users/42/orders/7` — конкретный заказ\n\n" +
                "Используй существительные во множественном числе.\n\n" +
                "## Сопоставление методов\n\n" +
                "| Метод | Путь | Действие |\n|-------|------|----------|\n| GET | /users | список |\n| GET | /users/42 | один |\n| POST | /users | создать |\n| PUT | /users/42 | заменить |\n| PATCH | /users/42 | обновить частично |\n| DELETE | /users/42 | удалить |\n\n" +
                "## HATEOAS\n\nТеоретически REST требует ссылки в ответах. В жизни никто этого не делает, кроме банков.",
            },
            {
              id: "versioning",
              kind: "READING",
              title: "Версионирование API",
              xp: 10,
              estMin: 7,
              body:
                "# Версионирование\n\n" +
                "Как только у API появляются клиенты — ломать его без оглядки нельзя.\n\n" +
                "## Три подхода\n\n" +
                "1. **URL**: `/v1/users` — самый понятный\n" +
                "2. **Header**: `Accept: application/vnd.app.v1+json` — академически правильный, на практике все ненавидят\n" +
                "3. **Query**: `/users?v=1` — для совсем простых случаев\n\n" +
                "**Рекомендация:** URL-версионирование. Простое, читаемое, кешируется.\n\n" +
                "## Стратегия\n\n" +
                "- Делать обратно-совместимые изменения, пока возможно (новые поля, новые эндпоинты)\n" +
                "- Ломающие — только в новой major-версии\n" +
                "- Старую версию держать минимум 6 месяцев после депрекейшена",
            },
            {
              id: "pagination",
              kind: "READING",
              title: "Пагинация и фильтрация",
              xp: 12,
              estMin: 10,
              body:
                "# Пагинация\n\n" +
                "## Offset-based\n\n" +
                "```\nGET /posts?limit=20&offset=40\n```\n\n" +
                "Просто, но **медленно** на больших таблицах (БД сканит offset+limit строк) и нестабильно (если данные меняются — пропустишь записи).\n\n" +
                "## Cursor-based\n\n" +
                "```\nGET /posts?limit=20&cursor=eyJpZCI6MTIzfQ\n```\n\n" +
                "Курсор — закодированный указатель (обычно последний `id` или `created_at`). Сервер возвращает `nextCursor`. Быстро, стабильно, лидерборды и ленты делают так.\n\n" +
                "## Фильтрация\n\n" +
                "```\nGET /products?category=books&min_price=10&max_price=50&sort=-created_at\n```\n\n" +
                "**Никогда не давай произвольный SQL через query** (`?where=...`) — это инъекция и проблемы с производительностью.",
            },
            {
              id: "idempotency",
              kind: "READING",
              title: "Идемпотентность и Idempotency-Key",
              xp: 12,
              estMin: 10,
              body:
                "# Идемпотентность\n\n" +
                "Операция идемпотентна, если **повторение даёт тот же результат**. PUT/DELETE идемпотентны по определению, POST — нет.\n\n" +
                "## Проблема с POST\n\nКлиент отправил POST /charge, не получил ответ (timeout). Что делать? Повторять — может списать дважды.\n\n" +
                "## Решение: Idempotency-Key\n\nКлиент шлёт случайный UUID в заголовке:\n\n" +
                "```\nPOST /payments\nIdempotency-Key: 7f4e2c8a-...\n{ \"amount\": 100 }\n```\n\n" +
                "Сервер хранит этот ключ + результат в Redis на 24 часа. Если приходит тот же ключ — возвращает сохранённый ответ, не выполняет заново.\n\n" +
                "Так делают Stripe, AWS, Twilio. **Так должен делать ты для всего, что списывает деньги или создаёт ресурсы.**",
            },
            {
              id: "rest-quiz",
              kind: "QUIZ",
              title: "Тест: REST",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Какой метод НЕ идемпотентный?",
                    options: ["GET", "PUT", "POST", "DELETE"],
                    correct: "POST",
                  },
                  {
                    q: "Какая пагинация лучше для лент с тысячами записей?",
                    options: ["Offset", "Cursor", "Random", "Без пагинации"],
                    correct: "Cursor",
                  },
                  {
                    q: "Зачем нужен Idempotency-Key?",
                    options: [
                      "ускоряет POST",
                      "позволяет безопасно повторять POST",
                      "обходит CORS",
                      "шифрует тело",
                    ],
                    correct: "позволяет безопасно повторять POST",
                  },
                ],
              },
            },
            {
              id: "rest-project",
              kind: "PROJECT",
              title: "Проект: API заметок",
              xp: 100,
              estMin: 60,
              body:
                "# Проект: REST API «Заметки»\n\n" +
                "Сделай Fastify + Prisma приложение со следующими эндпоинтами:\n\n" +
                "- `GET /notes?limit=20&cursor=...` — список с курсорной пагинацией\n" +
                "- `GET /notes/:id` — одна заметка\n" +
                "- `POST /notes` — создать (валидация через Zod)\n" +
                "- `PATCH /notes/:id` — обновить\n" +
                "- `DELETE /notes/:id` — удалить\n\n" +
                "## Требования\n\n" +
                "- Все ошибки через единый error handler\n" +
                "- 404 на несуществующий id\n" +
                "- Valid поля: title (3-200 символов), body (до 10 000)\n" +
                "- Тестируй через `curl` или REST Client\n\n" +
                "Этот проект — твоё первое CV-достойное API.",
            },
          ],
        },
      ],
    },
    {
      id: "auth",
      emoji: "🔐",
      title: "Аутентификация и сессии",
      description: "Cookies vs Tokens, JWT, OAuth, refresh-токены.",
      modules: [
        {
          id: "auth-foundations",
          title: "Основы",
          lessons: [
            {
              id: "cookies-vs-tokens",
              kind: "READING",
              title: "Cookies vs Tokens — выбор",
              xp: 12,
              estMin: 10,
              body:
                "# Cookies vs Tokens\n\n" +
                "## Session-cookie (классика)\n\n" +
                "Сервер хранит сессию в Redis/БД. Клиенту шлёт `Set-Cookie: session=<id>; HttpOnly; Secure; SameSite=Strict`. На каждый запрос браузер автоматически отправляет куку.\n\n" +
                "**Плюсы:** просто отзывать (удалил из Redis = вышел везде), безопаснее (HttpOnly = JS не достанет).\n\n" +
                "**Минусы:** сервер должен где-то хранить состояние, проблемы с CORS на разных доменах.\n\n" +
                "## JWT (токены)\n\n" +
                "Сервер выдаёт подписанный JSON. Клиент хранит в памяти или localStorage и шлёт `Authorization: Bearer <jwt>`.\n\n" +
                "**Плюсы:** stateless (масштабируется бесплатно), работает на разных доменах.\n\n" +
                "**Минусы:** **отозвать сложно**, нельзя выгнать пользователя сразу.\n\n" +
                "## Что выбрать\n\n" +
                "- Веб-приложение на одном домене → **session-cookie**\n" +
                "- Мобильное API, разные клиенты, микросервисы → **JWT**\n" +
                "- Большие системы → JWT-access (короткий) + refresh-token в БД",
            },
            {
              id: "jwt-deep",
              kind: "READING",
              title: "JWT глубже",
              xp: 14,
              estMin: 12,
              body:
                "# JWT (JSON Web Token)\n\n" +
                "Токен из трёх частей через точки: `header.payload.signature` (base64url).\n\n" +
                "## Header\n\n" +
                "```json\n{ \"alg\": \"HS256\", \"typ\": \"JWT\" }\n```\n\n" +
                "## Payload (claims)\n\n" +
                "```json\n{ \"sub\": \"user_123\", \"role\": \"admin\", \"exp\": 1735689600, \"iat\": 1735603200 }\n```\n\n" +
                "Стандартные claims: `sub`, `iss`, `aud`, `exp`, `iat`, `jti`.\n\n" +
                "## Signature\n\n" +
                "HMAC-SHA256 от `header.payload` секретом сервера. Изменишь хоть бит — подпись не сойдётся.\n\n" +
                "## Что НЕ хранить в JWT\n\n" +
                "- Пароли\n- Полные данные пользователя\n- Что-то секретное\n\nJWT **не зашифрован**, любой может прочитать payload (открой jwt.io).\n\n" +
                "## Алгоритмы\n\n" +
                "- **HS256** — симметричный секрет, для одного сервера\n" +
                "- **RS256** — асимметричный (приватный/публичный ключ), для микросервисов: один сервис подписывает, другие проверяют публичным\n\n" +
                "**Никогда** не используй `alg: none`. Несколько библиотек годами имели CVE из-за этого.",
            },
            {
              id: "refresh-tokens",
              kind: "READING",
              title: "Refresh tokens и ротация",
              xp: 14,
              estMin: 10,
              body:
                "# Refresh tokens\n\n" +
                "Access-токен короткий (15 мин). Когда он истёк, клиент шлёт **refresh-токен**, и получает новую пару.\n\n" +
                "## Зачем\n\n" +
                "- Если access украден — он скоро протухнет\n" +
                "- Refresh хранится в БД → можно отозвать\n" +
                "- При каждом обмене — старый refresh инвалидируется (rotation)\n\n" +
                "## Схема\n\n" +
                "```\n[register/login] → access (15m) + refresh (30d)\n[15m прошло] клиент: POST /refresh { refreshToken }\nсервер: проверил → отозвал старый → выдал новые → сохранил\n```\n\n" +
                "## Как хранить\n\n" +
                "В таблице `refresh_tokens`:\n```sql\nid, user_id, token_hash, ip, user_agent, expires_at, revoked_at\n```\n\n" +
                "**Хешируй** refresh-токен через SHA-256 перед сохранением. Если БД утечёт — токены не извлечь.\n\n" +
                "## Token reuse detection\n\nЕсли пришёл уже отозванный refresh — это атака. Отзываем **все** токены пользователя и принудительно разлогиниваем.",
            },
            {
              id: "oauth",
              kind: "READING",
              title: "OAuth 2.0 — Sign in with Google",
              xp: 14,
              estMin: 12,
              body:
                "# OAuth 2.0 в двух словах\n\n" +
                "OAuth = делегирование. Пользователь даёт твоему приложению доступ к Google/GitHub без передачи пароля.\n\n" +
                "## Authorization Code Flow (для веба)\n\n" +
                "1. Кликнули «Войти через Google» → редирект на `accounts.google.com/o/oauth2/v2/auth?...&redirect_uri=...&state=...&code_challenge=...`\n" +
                "2. Юзер согласился → Google редиректит обратно на `redirect_uri?code=ABC&state=...`\n" +
                "3. Сервер обменивает `code` + `code_verifier` на `access_token` через POST на `oauth2.googleapis.com/token`\n" +
                "4. Идёт за профилем `userinfo`, создаёт юзера локально, выдаёт свой JWT\n\n" +
                "## PKCE\n\n" +
                "Code-verifier + code-challenge защищают от перехвата `code`. **Используй всегда**, даже на сервере.\n\n" +
                "## State\n\n" +
                "Случайная строка, защищающая от CSRF. Сервер генерит, проверяет на возврате.\n\n" +
                "## Готовые библиотеки\n\nНе пиши OAuth с нуля. Используй `Auth.js`, `Passport`, `lucia-auth`.",
            },
            {
              id: "auth-quiz",
              kind: "QUIZ",
              title: "Тест: аутентификация",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "JWT-токен зашифрован?",
                    options: ["Да", "Нет, только подписан", "Зависит от alg", "Только payload"],
                    correct: "Нет, только подписан",
                  },
                  {
                    q: "Какой alg НЕЛЬЗЯ использовать?",
                    options: ["HS256", "RS256", "ES256", "none"],
                    correct: "none",
                  },
                  {
                    q: "Зачем refresh-токен?",
                    options: [
                      "ускоряет запросы",
                      "позволяет иметь короткий access + долгую сессию",
                      "обходит CORS",
                      "шифрует пароль",
                    ],
                    correct: "позволяет иметь короткий access + долгую сессию",
                  },
                  {
                    q: "Как хранить refresh-токен в БД?",
                    options: ["plain text", "bcrypt", "sha-256 хеш", "не хранить"],
                    correct: "sha-256 хеш",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "validation-security",
      emoji: "🛡️",
      title: "Валидация и безопасность",
      description: "Zod, OWASP Top 10, rate-limit, secrets.",
      modules: [
        {
          id: "input-validation",
          title: "Валидация входных данных",
          lessons: [
            {
              id: "zod-basics",
              kind: "READING",
              title: "Zod — валидация на стероидах",
              xp: 12,
              estMin: 10,
              body:
                "# Zod\n\n" +
                "Zod — TypeScript-first библиотека валидации. Один и тот же код генерирует и схему, и тип.\n\n" +
                "```ts\nimport { z } from \"zod\";\n\nconst CreateUserSchema = z.object({\n  email: z.string().email(),\n  username: z.string().min(3).max(32).regex(/^[a-z0-9_]+$/i),\n  age: z.number().int().min(13).optional(),\n  role: z.enum([\"user\", \"admin\"]).default(\"user\"),\n});\n\ntype CreateUserDto = z.infer<typeof CreateUserSchema>;\n\nconst data = CreateUserSchema.parse(req.body); // 422 если невалидно\n```\n\n" +
                "## Где валидировать\n\n" +
                "- HTTP body, query, params\n- Что прочитал из файла\n- Что вернул внешний API\n- Переменные окружения (Zod ловит опечатки в .env)\n\n" +
                "## safeParse\n\n" +
                "```ts\nconst r = Schema.safeParse(input);\nif (!r.success) return reply.status(422).send(r.error.flatten());\n```",
            },
            {
              id: "owasp",
              kind: "READING",
              title: "OWASP Top 10 для backend",
              xp: 15,
              estMin: 12,
              body:
                "# OWASP Top 10 — обязательное чтение\n\n" +
                "## A01 Broken Access Control\nПроверяй авторизацию на КАЖДОМ эндпоинте. Не доверяй фронту.\n\n" +
                "## A02 Cryptographic Failures\nПароли — argon2/bcrypt. Никогда — sha256/md5. Секреты — в env, не в коде.\n\n" +
                "## A03 Injection\nSQL, NoSQL, OS-команды. **Параметризованные запросы** (Prisma делает сам), не конкатенируй.\n\n" +
                "## A04 Insecure Design\nThreat modeling. Подумай, как атакующий может тебя сломать.\n\n" +
                "## A05 Security Misconfiguration\nDebug-режим в проде, Adminer наружу, дефолтные пароли — всё это сюда.\n\n" +
                "## A06 Vulnerable Components\n`npm audit` регулярно. Обновляй пакеты.\n\n" +
                "## A07 Identification & Auth Failures\nНет brute-force защиты, слабые пароли, токены без срока.\n\n" +
                "## A08 Software & Data Integrity\nCI/CD без подписей, supply-chain атаки. Lockfile + integrity hashes.\n\n" +
                "## A09 Logging & Monitoring Failures\nНет логов = атаку не увидишь. Pino + централизованный лог-стор.\n\n" +
                "## A10 SSRF\nНе делай fetch по URL от пользователя без allowlist. Иначе = доступ к внутренней сети.",
            },
            {
              id: "rate-limit",
              kind: "READING",
              title: "Rate limiting",
              xp: 12,
              estMin: 10,
              body:
                "# Rate limiting\n\n" +
                "Защита от brute-force, скрейперов, DDoS на дешёвых эндпоинтах.\n\n" +
                "## Алгоритмы\n\n" +
                "- **Fixed window**: «не больше 100 за минуту». Просто, но проблема на стыке окон.\n" +
                "- **Sliding window**: то же, но скользящее окно. Точнее.\n" +
                "- **Token bucket**: каждое N мс капает токен, запрос тратит. Естественные «всплески».\n" +
                "- **Leaky bucket**: запросы идут с фиксированной скоростью.\n\n" +
                "## Реализация в Node\n\nВсегда через **Redis** (не в памяти процесса — иначе у каждой реплики свой счётчик).\n\n" +
                "```ts\nimport rateLimit from \"@fastify/rate-limit\";\nawait app.register(rateLimit, {\n  max: 100,\n  timeWindow: \"1 minute\",\n  redis,\n});\n```\n\n" +
                "## По какому ключу\n\n" +
                "- IP — самый простой\n- userId после auth — точнее\n- IP+endpoint — самое строгое (для /login)",
            },
            {
              id: "secrets",
              kind: "READING",
              title: "Секреты и .env",
              xp: 10,
              estMin: 7,
              body:
                "# Секреты\n\n" +
                "## Базовые правила\n\n" +
                "- **Никогда** не коммить `.env`. В `.gitignore` сразу.\n" +
                "- В коммит идёт только `.env.example` со списком ключей.\n" +
                "- В проде — секреты из менеджера: AWS Secrets Manager, Vault, Doppler, 1Password CLI.\n\n" +
                "## Валидация env\n\n" +
                "```ts\nconst Env = z.object({\n  DATABASE_URL: z.string().url(),\n  JWT_SECRET: z.string().min(32),\n  REDIS_URL: z.string().url().default(\"redis://localhost:6379\"),\n});\nexport const env = Env.parse(process.env);\n```\n\n" +
                "Если приложение не запустилось — пусть упадёт громко с понятной ошибкой, а не молча работает с битой конфигурацией.\n\n" +
                "## Ротация\n\nВсе ключи должны иметь процесс ротации. Если секрет утёк — за час должен быть заменён.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "api-styles",
      emoji: "🎨",
      title: "Стили API: GraphQL, gRPC, OpenAPI",
      description: "Когда REST мало или много. Сравнение и реальные кейсы.",
      modules: [
        {
          id: "api-styles-intro",
          title: "Альтернативы REST",
          lessons: [
            {
              id: "openapi-spec",
              kind: "READING",
              title: "OpenAPI / Swagger — задокументируй REST",
              xp: 12,
              estMin: 10,
              body:
                "# OpenAPI\n\n" +
                "Стандарт описания REST API в YAML/JSON. Из него генерится:\n\n" +
                "- Документация (Swagger UI, Redoc)\n" +
                "- Клиенты на любом языке (TypeScript, Python, Java)\n" +
                "- Mock-сервер для фронта\n" +
                "- Валидация запросов в gateway\n\n" +
                "## Минимум\n\n" +
                "```yaml\nopenapi: 3.0.3\ninfo: { title: My API, version: 1.0.0 }\npaths:\n  /users/{id}:\n    get:\n      parameters:\n        - in: path\n          name: id\n          schema: { type: string }\n          required: true\n      responses:\n        '200':\n          description: OK\n          content:\n            application/json:\n              schema: { $ref: '#/components/schemas/User' }\ncomponents:\n  schemas:\n    User:\n      type: object\n      properties:\n        id: { type: string }\n        email: { type: string, format: email }\n```\n\n" +
                "## В Fastify — генерится из кода\n\n```ts\nimport swagger from '@fastify/swagger';\nimport swaggerUi from '@fastify/swagger-ui';\n\nawait app.register(swagger, { openapi: { info: { title: 'API', version: '1.0' } } });\nawait app.register(swaggerUi, { routePrefix: '/docs' });\n```\n\nКаждый route с JSON-Schema или Zod (через `fastify-type-provider-zod`) — попадёт в спеку автоматом.\n\n" +
                "## Зачем заморачиваться\n\nКонтракт-первый подход. Фронт и бэк работают параллельно по согласованной спеке. Бесплатные клиенты вместо ручного fetch'а. Тесты на спеку (Dredd, Schemathesis).",
            },
            {
              id: "graphql-basics",
              kind: "READING",
              title: "GraphQL — клиент сам выбирает",
              xp: 14,
              estMin: 12,
              body:
                "# GraphQL\n\n" +
                "Один эндпоинт `/graphql`. Клиент шлёт запрос с нужными полями, получает ровно их.\n\n" +
                "## Запрос\n\n```graphql\nquery {\n  user(id: \"42\") {\n    name\n    email\n    posts(first: 5) {\n      title\n      createdAt\n    }\n  }\n}\n```\n\nОтвет — ровно эта форма. Никаких over-fetching и under-fetching.\n\n" +
                "## Schema (источник истины)\n\n```graphql\ntype User {\n  id: ID!\n  email: String!\n  name: String\n  posts(first: Int = 10): [Post!]!\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  createdAt: String!\n}\n\ntype Query {\n  user(id: ID!): User\n  users(limit: Int): [User!]!\n}\n\ntype Mutation {\n  createPost(title: String!, body: String!): Post!\n}\n```\n\n" +
                "## Resolvers\n\n```ts\nconst resolvers = {\n  Query: {\n    user: (_, { id }) => prisma.user.findUnique({ where: { id } }),\n  },\n  User: {\n    posts: (user, { first }) =>\n      prisma.post.findMany({ where: { authorId: user.id }, take: first }),\n  },\n};\n```\n\n" +
                "## Главный gotcha — N+1\n\nЗапрос с 100 user'ами выльется в 100 SELECT'ов за posts. **Используй DataLoader** для батчинга.\n\n" +
                "## Когда брать GraphQL\n\n- Мобайл с разными версиями (нужно гибко выбирать поля)\n- Много frontend-команд, которые не хотят ждать backend\n- BFF (backend-for-frontend) для сложных дашбордов\n\n## Когда не GraphQL\n\n- Простой CRUD — REST проще\n- Файлы — REST/multipart лучше\n- Реалтайм потоки — WebSocket\n- Если в команде нет опыта (легко выстрелить себе в ногу с N+1, авторизацией, кэшем)",
            },
            {
              id: "grpc-when",
              kind: "READING",
              title: "gRPC: когда брать и плюсы",
              xp: 12,
              estMin: 8,
              body:
                "# gRPC\n\n" +
                "Подробнее в Уровне 6, здесь — суть и когда использовать.\n\n" +
                "## Что это\n\nRPC поверх HTTP/2 + Protocol Buffers (бинарный формат). Контракт — `.proto` файл, из которого генерируются клиент и сервер для любого языка.\n\n" +
                "## Преимущества\n\n- **5-10× быстрее REST** (бинарный, HTTP/2 multiplexing)\n- **Streaming** в обе стороны\n- **Строгая типизация** контракта\n- **Полиглотные** клиенты из коробки\n\n" +
                "## Когда брать\n\n- **Внутренние** микросервисы, особенно если их много\n- Высоконагруженные APIs (мобайл с медленной сетью — Protobuf экономит трафик)\n- Стриминг сервер→клиент (live-данные без WebSocket)\n\n" +
                "## Когда НЕ брать\n\n- Веб напрямую (нужен gRPC-Web + прокси, и это сложнее REST)\n- Публичное API (REST/GraphQL понятнее интегрировать)\n- Маленькая команда без опыта (генераторы, билд-step)\n\n" +
                "## Tooling\n\n- `@grpc/grpc-js` + `@grpc/proto-loader` — Node.js клиент/сервер\n- `buf` — современный CLI для proto (lint, breaking change detection)\n- `grpcurl` — curl для gRPC, для дебага\n- `Connect-RPC` — современная альтернатива, работает поверх HTTP/1.1, удобнее для веба",
            },
            {
              id: "rest-vs-all",
              kind: "QUIZ",
              title: "Тест: какой стиль API",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Публичный API маркетплейса. Что выбрать?",
                    options: ["gRPC", "GraphQL", "REST + OpenAPI", "WebSocket"],
                    correct: "REST + OpenAPI",
                    explanation: "Самый интегрируемый внешними клиентами.",
                  },
                  {
                    q: "Внутренние микросервисы с высокой нагрузкой:",
                    options: ["REST", "gRPC", "GraphQL", "FTP"],
                    correct: "gRPC",
                  },
                  {
                    q: "Мобильное приложение, версии разные, нужны гибкие выборки:",
                    options: ["REST", "gRPC", "GraphQL", "SOAP"],
                    correct: "GraphQL",
                  },
                  {
                    q: "Главная проблема GraphQL на бэкенде:",
                    options: [
                      "медленный JSON",
                      "N+1 запросы и сложная авторизация",
                      "не работает с CDN",
                      "нет TypeScript",
                    ],
                    correct: "N+1 запросы и сложная авторизация",
                  },
                ],
              },
            },
            {
              id: "graphql-mini-project",
              kind: "PROJECT",
              title: "Проект: мини-GraphQL для блога",
              xp: 80,
              estMin: 45,
              body:
                "# Проект: GraphQL для блога\n\n" +
                "Возьми проект «блог с тегами» из L3 и добавь GraphQL-эндпоинт.\n\n" +
                "## Стек\n\n- **GraphQL Yoga** или **Apollo Server**\n- **Pothos** или **TypeGraphQL** для type-safe схем\n- **DataLoader** против N+1\n\n## Что должно работать\n\n- `query { posts(tag: \"node\") { id, title, author { name } } }`\n- `query { post(id) { tags { slug }, author { posts { title } } } }`\n- `mutation { createPost(input: {...}) { id } }`\n\n## Защита\n\n- **Depth limit** (5 уровней) — защита от вложенных запросов\n- **Query complexity** — стоимость запроса в баллах\n- **Persisted queries** — клиент шлёт хеш, сервер выполняет известный запрос\n\nЭти штуки — обязательны для публичного GraphQL.",
            },
          ],
        },
      ],
    },
  ],
};
