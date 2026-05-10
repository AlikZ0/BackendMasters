import type { Track } from "./types";

export const LEVEL_3: Track = {
  id: "l3-databases",
  level: "MIDDLE",
  title: "Уровень 3 — Базы данных",
  description:
    "SQL, PostgreSQL, ORM, NoSQL и Redis — данные, на которых живёт твой backend.",
  hours: 16,
  courses: [
    {
      id: "sql-foundations",
      emoji: "🗄️",
      title: "SQL с нуля",
      description: "Реляционная модель, запросы, JOIN, индексы, транзакции.",
      modules: [
        {
          id: "sql-core",
          title: "Ядро SQL",
          lessons: [
            {
              id: "relational-model",
              kind: "READING",
              title: "Реляционная модель",
              xp: 10,
              estMin: 8,
              body:
                "# Реляционная модель\n\n" +
                "Данные в **таблицах** (отношения), строки = записи, колонки = поля. Связи — через **внешние ключи**.\n\n" +
                "## Нормальные формы\n\n" +
                "- **1NF** — атомарные значения, без массивов в ячейках\n" +
                "- **2NF** — все неключевые поля зависят от полного ключа\n" +
                "- **3NF** — нет транзитивных зависимостей\n\n" +
                "На практике достаточно знать: **3NF — дефолт**. Денормализуй только когда есть конкретная боль с производительностью.\n\n" +
                "## Пример нормализации\n\nПлохо:\n```\nusers(id, name, orders_csv)  -- \"1, 2, 5\"\n```\n\nХорошо:\n```\nusers(id, name)\norders(id, user_id, total)\n```\n\nТеперь можно фильтровать, индексировать, считать SUM(total) за O(log n).",
            },
            {
              id: "select-where",
              kind: "READING",
              title: "SELECT, WHERE, ORDER, LIMIT",
              xp: 10,
              estMin: 8,
              body:
                "# Базовый SELECT\n\n" +
                "```sql\nSELECT id, email, created_at\nFROM users\nWHERE created_at >= '2025-01-01'\n  AND email LIKE '%@gmail.com'\nORDER BY created_at DESC\nLIMIT 50;\n```\n\n" +
                "## Агрегации\n\n" +
                "```sql\nSELECT country, COUNT(*) AS users, AVG(age) AS avg_age\nFROM users\nGROUP BY country\nHAVING COUNT(*) > 100\nORDER BY users DESC;\n```\n\n" +
                "Помни: **WHERE** до GROUP BY, **HAVING** — после.\n\n" +
                "## DISTINCT\n\n" +
                "```sql\nSELECT DISTINCT country FROM users;\n```\n\nЧасто признак того, что схема не та (см. JOIN).",
            },
            {
              id: "joins",
              kind: "READING",
              title: "JOIN'ы — наглядно",
              xp: 14,
              estMin: 12,
              body:
                "# JOIN'ы\n\n" +
                "```sql\nSELECT u.email, o.total\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id;\n```\n\n" +
                "## Виды\n\n" +
                "- **INNER JOIN** — только пары, у которых есть совпадение в обеих таблицах\n" +
                "- **LEFT JOIN** — все из левой + совпадения из правой (NULL если нет)\n" +
                "- **RIGHT JOIN** — наоборот, редко используется\n" +
                "- **FULL OUTER JOIN** — все из обеих + NULL'ы\n" +
                "- **CROSS JOIN** — декартово произведение, осторожно\n\n" +
                "## Пример с LEFT JOIN\n\nХочу пользователей и сумму их заказов (включая тех, у кого заказов нет):\n\n" +
                "```sql\nSELECT u.id, u.email, COALESCE(SUM(o.total), 0) AS total_spent\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.id, u.email;\n```\n\n" +
                "`COALESCE` подменит NULL на 0 для тех, у кого нет заказов.",
            },
            {
              id: "indexes",
              kind: "READING",
              title: "Индексы — почему запрос за 5мс или за 5с",
              xp: 16,
              estMin: 12,
              body:
                "# Индексы\n\n" +
                "Индекс — отсортированная структура (B-tree обычно), которая позволяет находить строки за O(log n) вместо O(n).\n\n" +
                "## Когда создавать\n\n" +
                "- Колонки в WHERE, JOIN, ORDER BY\n" +
                "- Foreign key (Postgres НЕ создаёт автоматически)\n" +
                "- Уникальные поля (`UNIQUE INDEX`)\n\n" +
                "## Когда НЕ создавать\n\n" +
                "- Маленькие таблицы (< 1000 строк)\n" +
                "- Колонки, которые часто меняются (индекс надо поддерживать)\n" +
                "- Колонки с низкой selectivity (например, boolean)\n\n" +
                "## Композитные индексы\n\n" +
                "```sql\nCREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);\n```\n\n" +
                "Этот индекс работает для:\n- `WHERE user_id = ?`\n- `WHERE user_id = ? ORDER BY created_at DESC`\n- НЕ работает для `WHERE created_at = ?` (порядок колонок важен!)\n\n" +
                "## EXPLAIN ANALYZE\n\nВсегда смотри план запроса:\n```sql\nEXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;\n```\n\nЕсли видишь `Seq Scan` на большой таблице — нужен индекс.",
            },
            {
              id: "transactions",
              kind: "READING",
              title: "Транзакции и уровни изоляции",
              xp: 16,
              estMin: 14,
              body:
                "# Транзакции\n\n" +
                "Транзакция = группа операций, которая либо вся успешна, либо вся откатывается. **ACID**.\n\n" +
                "## Когда нужна\n\n" +
                "Любое действие, где меняется > 1 запись и должны измениться либо все, либо ни одна:\n- перевод денег между счетами\n- создание заказа + списание со склада\n- регистрация (user + audit_log)\n\n" +
                "## В Prisma\n\n" +
                "```ts\nawait prisma.$transaction(async (tx) => {\n  await tx.account.update({ where: { id: from }, data: { balance: { decrement: 100 } } });\n  await tx.account.update({ where: { id: to }, data: { balance: { increment: 100 } } });\n});\n```\n\n" +
                "## Уровни изоляции (от слабого к сильному)\n\n" +
                "1. **Read Uncommitted** — видишь чужие незакоммиченные изменения. Никогда не используй.\n" +
                "2. **Read Committed** (дефолт Postgres) — видишь только закоммиченное. Возможны non-repeatable read.\n" +
                "3. **Repeatable Read** — внутри транзакции одни и те же запросы дают одни и те же ответы. Может быть phantom read.\n" +
                "4. **Serializable** — как будто транзакции выполняются одна за другой. Самый безопасный, дорогой.\n\n" +
                "## Аномалии\n\n" +
                "- **Lost update** — два UPDATE затёрли друг друга\n- **Dirty read** — прочитали незакоммиченное\n- **Non-repeatable read** — повторный SELECT даёт другой результат\n- **Phantom read** — появились/исчезли строки между SELECT'ами\n\n" +
                "Для денег и счётчиков — `SELECT FOR UPDATE` или Repeatable Read.",
            },
            {
              id: "sql-quiz",
              kind: "QUIZ",
              title: "Тест: SQL",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Какой JOIN вернёт всех пользователей, даже без заказов?",
                    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
                    correct: "LEFT JOIN",
                  },
                  {
                    q: "Когда сработает индекс (a, b)?",
                    options: ["WHERE b = ?", "WHERE a = ?", "WHERE c = ?", "никогда"],
                    correct: "WHERE a = ?",
                  },
                  {
                    q: "Уровень изоляции по умолчанию в Postgres?",
                    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
                    correct: "Read Committed",
                  },
                  {
                    q: "Что такое ACID?",
                    options: [
                      "Atomicity, Consistency, Isolation, Durability",
                      "Async, Cache, Index, Data",
                      "Auth, Cookies, IP, Domain",
                      "Apache, CouchDB, Influx, Druid",
                    ],
                    correct: "Atomicity, Consistency, Isolation, Durability",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "postgres-deep",
      emoji: "🐘",
      title: "PostgreSQL глубже",
      description: "Postgres-специфика: типы, EXPLAIN, vacuum, репликация.",
      modules: [
        {
          id: "pg-features",
          title: "Возможности Postgres",
          lessons: [
            {
              id: "pg-types",
              kind: "READING",
              title: "Типы Postgres, которые надо знать",
              xp: 12,
              estMin: 10,
              body:
                "# Типы Postgres\n\n" +
                "## Числа\n\n" +
                "- `INTEGER` (4 байта), `BIGINT` (8 байт), `SMALLINT`\n" +
                "- `NUMERIC(10, 2)` — точная арифметика, **используй для денег**\n" +
                "- `DOUBLE PRECISION` — float64, не для денег\n\n" +
                "## Строки\n\n" +
                "- `TEXT` — без ограничений длины\n- `VARCHAR(n)` — почти то же, ограничение на длину\n- `CHAR(n)` — фиксированная, паддит пробелами, не используй\n\n" +
                "## Время\n\n" +
                "- `TIMESTAMPTZ` — **всегда** используй это, не TIMESTAMP. Хранит UTC.\n- `DATE` — только дата\n- `INTERVAL` — длительность\n\n" +
                "## JSON\n\n" +
                "- `JSON` — текстовое хранилище\n- `JSONB` — бинарное, индексируемое, **используй это**\n\n" +
                "```sql\nSELECT data->>'email' FROM users WHERE data->>'role' = 'admin';\nCREATE INDEX ON users USING GIN (data);\n```\n\n" +
                "## UUID\n\n" +
                "```sql\nid UUID PRIMARY KEY DEFAULT gen_random_uuid()\n```\n\nЛучше autoincrement: не раскрывает количество записей, не конфликтует при шардинге.",
            },
            {
              id: "explain-analyze",
              kind: "READING",
              title: "EXPLAIN ANALYZE — читаем план",
              xp: 16,
              estMin: 12,
              body:
                "# EXPLAIN ANALYZE\n\n" +
                "Главный инструмент диагностики медленных запросов.\n\n" +
                "```sql\nEXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)\nSELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10;\n```\n\n" +
                "## Что искать\n\n" +
                "- **Seq Scan** на большой таблице → нужен индекс\n" +
                "- **Index Scan** vs **Index Only Scan** → последний быстрее\n" +
                "- **Nested Loop** vs **Hash Join** vs **Merge Join** → разные стратегии для разных размеров\n" +
                "- **Rows removed by filter: 99000** → выбрали 100 из 100000, плохой план\n" +
                "- **actual time** vs **estimated time** → большое расхождение = устаревшая статистика, нужен `ANALYZE table_name`\n\n" +
                "## pgAdmin / DataGrip / DBeaver\n\nГрафический визуализатор плана сильно облегчает жизнь.\n\n" +
                "## Полезный фокус\n\nЕсли запрос медленный, попробуй закрыть его в подзапрос с LIMIT, потом джоинить:\n\n```sql\nWITH recent AS (\n  SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10\n)\nSELECT r.*, u.email FROM recent r JOIN users u ON u.id = r.user_id;\n```",
            },
            {
              id: "pg-vacuum",
              kind: "READING",
              title: "VACUUM, MVCC и bloat",
              xp: 14,
              estMin: 10,
              body:
                "# MVCC и почему DB пухнет\n\n" +
                "Postgres использует MVCC: при UPDATE он **не меняет строку на месте**, а создаёт новую и помечает старую как мёртвую. Старые версии нужны для конкурентных транзакций.\n\n" +
                "## Что такое VACUUM\n\nФоновый процесс, который очищает мёртвые строки и помечает место как переиспользуемое.\n\n" +
                "## Что такое bloat\n\nЕсли VACUUM не успевает — таблица растёт в размере, индексы тоже, запросы тормозят.\n\n" +
                "## autovacuum\n\nВключён по умолчанию. Тюнится через `autovacuum_vacuum_scale_factor`. На больших таблицах часто стоит уменьшить порог.\n\n" +
                "## Что делать с bloat\n\n- `VACUUM FULL` — пересобирает таблицу, **блокирует** её\n- `pg_repack` — то же без блокировки\n- `CLUSTER` — пересортировка по индексу\n\n" +
                "## TRUNCATE vs DELETE\n\n`DELETE FROM big_table` — генерирует мёртвые строки, медленно.\n`TRUNCATE big_table` — мгновенно, но без триггеров и не видит транзакция другого сеанса.",
            },
            {
              id: "replication-basics",
              kind: "READING",
              title: "Репликация: streaming + WAL",
              xp: 14,
              estMin: 10,
              body:
                "# Репликация Postgres\n\n" +
                "## WAL\n\nWrite-Ahead Log — журнал всех изменений. **Сначала** в лог, потом в файлы данных. Это и основа репликации, и crash recovery.\n\n" +
                "## Streaming Replication\n\nMaster шлёт WAL по сети репликам. Они применяют у себя.\n\n" +
                "- **Async replica** — может отставать, но не тормозит мастер\n- **Sync replica** — мастер ждёт подтверждения хотя бы одной реплики, безопаснее, медленнее\n\n" +
                "## Архитектуры\n\n" +
                "- 1 master + N read-replicas — стандарт. Запись на master, чтение распределяется.\n- Hot standby — реплика принимает read-запросы\n- Failover — если master упал, одна из реплик становится новым master\n\n" +
                "## Проблема с readers\n\nКогда пишешь и сразу читаешь — реплика может не успеть. Решения:\n- Свежие данные читать с master\n- Использовать `synchronous_commit = remote_apply`\n- Sticky read для конкретных пользователей",
            },
            {
              id: "explain-code",
              kind: "CODE",
              title: "Код: оптимизируй запрос",
              xp: 40,
              estMin: 15,
              body:
                "Перепиши SELECT, чтобы использовался индекс по `(user_id, created_at)`. Текущий — Seq Scan.\n\n" +
                "Изначально:\n```sql\nSELECT * FROM orders\nWHERE created_at > NOW() - INTERVAL '7 days'\n  AND user_id IN (SELECT id FROM users WHERE country = 'RU');\n```",
              payload: {
                starter:
                  "-- Перепиши на JOIN и используй явный индекс по (user_id, created_at)\nSELECT o.*\nFROM orders o\n-- твой код здесь\n",
                mustContain: ["JOIN", "users", "ON", "WHERE"],
                hint: "INNER JOIN users u ON u.id = o.user_id WHERE u.country='RU' AND o.created_at > ...",
              },
            },
          ],
        },
      ],
    },
    {
      id: "orm-prisma",
      emoji: "💎",
      title: "ORM и Prisma",
      description: "Миграции, связи, transactions, антипаттерны.",
      modules: [
        {
          id: "prisma-core",
          title: "Prisma в боевых задачах",
          lessons: [
            {
              id: "prisma-schema",
              kind: "READING",
              title: "schema.prisma — первый шаг",
              xp: 12,
              estMin: 10,
              body:
                "# Prisma schema\n\n" +
                "```prisma\nmodel User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  name      String\n  posts     Post[]\n  createdAt DateTime @default(now())\n\n  @@index([createdAt(sort: Desc)])\n}\n\nmodel Post {\n  id      String @id @default(cuid())\n  title   String\n  content String\n  author  User   @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  authorId String\n}\n```\n\n" +
                "## Команды\n\n" +
                "```bash\nnpx prisma migrate dev --name init       # создать миграцию + накатить\nnpx prisma migrate deploy                 # применить в проде\nnpx prisma generate                       # обновить клиент\nnpx prisma studio                         # GUI для базы\n```\n\n" +
                "## Главное\n\nКаждое изменение схемы — отдельная миграция. Они коммитятся в git. Деплой накатывает только новые.",
            },
            {
              id: "prisma-relations",
              kind: "READING",
              title: "Связи и каскады",
              xp: 12,
              estMin: 10,
              body:
                "# Связи в Prisma\n\n" +
                "## 1:N\n\n" +
                "```prisma\nmodel User { posts Post[] }\nmodel Post { author User @relation(fields: [authorId], references: [id]) authorId String }\n```\n\n" +
                "## N:N\n\n" +
                "Через таблицу-стыковку:\n```prisma\nmodel Post  { tags PostTag[] }\nmodel Tag   { posts PostTag[] }\nmodel PostTag {\n  postId String; tagId String\n  post Post @relation(fields: [postId], references: [id])\n  tag  Tag  @relation(fields: [tagId], references: [id])\n  @@id([postId, tagId])\n}\n```\n\n" +
                "## Каскады\n\n" +
                "- `onDelete: Cascade` — удалили User → удалятся все Post\n" +
                "- `onDelete: SetNull` — поставит null\n- `onDelete: Restrict` — запретит удаление, если есть зависимые\n\n" +
                "## Include vs Select\n\n" +
                "```ts\n// все поля + posts\nawait prisma.user.findUnique({ where: { id }, include: { posts: true } });\n\n// только нужные\nawait prisma.user.findUnique({\n  where: { id },\n  select: { id: true, email: true, posts: { select: { title: true } } },\n});\n```\n\nselect быстрее и легче по сети.",
            },
            {
              id: "n-plus-one",
              kind: "READING",
              title: "N+1 — главный убийца производительности",
              xp: 14,
              estMin: 10,
              body:
                "# N+1 проблема\n\n" +
                "```ts\n// плохо: 1 запрос за пользователями + N запросов за постами\nconst users = await prisma.user.findMany();\nfor (const u of users) {\n  u.posts = await prisma.post.findMany({ where: { authorId: u.id } });\n}\n```\n\n" +
                "## Как ловить\n\n- Включи логирование: `new PrismaClient({ log: ['query'] })`\n- Если на одной странице видишь сотни SELECT'ов — это N+1\n\n" +
                "## Как чинить\n\n" +
                "**1. include**\n```ts\nconst users = await prisma.user.findMany({ include: { posts: true } });\n// 1-2 запроса\n```\n\n" +
                "**2. DataLoader** для GraphQL и для случаев, когда include невозможен:\n```ts\nimport DataLoader from 'dataloader';\nconst userLoader = new DataLoader(async (ids) => {\n  const users = await prisma.user.findMany({ where: { id: { in: ids as string[] } } });\n  return ids.map(id => users.find(u => u.id === id));\n});\n```\n\n" +
                "DataLoader батчит и кэширует на время одного запроса. Один запрос вместо сотни.",
            },
            {
              id: "prisma-tx",
              kind: "READING",
              title: "Транзакции в Prisma",
              xp: 12,
              estMin: 8,
              body:
                "# Транзакции\n\n" +
                "## Sequential\n\n" +
                "```ts\nconst [post, user] = await prisma.$transaction([\n  prisma.post.create({ data: { ... } }),\n  prisma.user.update({ where: { id }, data: { postsCount: { increment: 1 } } }),\n]);\n```\n\n" +
                "Все или ничего. Удобно для пары операций.\n\n" +
                "## Interactive\n\n" +
                "```ts\nawait prisma.$transaction(async (tx) => {\n  const post = await tx.post.create({ data });\n  if (post.title.includes('spam')) throw new Error('spam');\n  await tx.user.update({ where: { id: data.authorId }, data: { postsCount: { increment: 1 } } });\n});\n```\n\n" +
                "Когда нужна логика между шагами.\n\n" +
                "## Изоляция\n\n```ts\nawait prisma.$transaction(fn, { isolationLevel: 'Serializable' });\n```\n\n" +
                "## Тайм-ауты\n\nДефолт — 5 секунд. Длинные транзакции = блокировки. Если транзакция занимает > 1 сек, что-то не так.",
            },
            {
              id: "prisma-project",
              kind: "PROJECT",
              title: "Проект: блог с тегами",
              xp: 100,
              estMin: 60,
              body:
                "# Проект: блог-API\n\n" +
                "Используй Prisma + Postgres + Fastify.\n\n" +
                "## Модели\n\n" +
                "- User (id, email, password)\n- Post (id, title, body, authorId)\n- Tag (id, slug)\n- PostTag (M:N)\n\n" +
                "## Эндпоинты\n\n" +
                "- `POST /posts` — создать пост с тегами (создать недостающие)\n- `GET /posts?tag=node` — фильтр по тегу\n- `GET /posts/:id` — пост с тегами и автором (без N+1)\n- `DELETE /posts/:id` — каскадно удалит связи в PostTag\n\n" +
                "## Бонус\n\n- Транзакция на создание поста + апдейт счётчика автора\n- Индекс по (authorId, createdAt DESC)\n- Тест EXPLAIN — нет Seq Scan",
            },
          ],
        },
      ],
    },
    {
      id: "nosql-redis",
      emoji: "⚡",
      title: "NoSQL и Redis",
      description: "Когда не SQL, MongoDB, Redis для кэша и очередей.",
      modules: [
        {
          id: "nosql-when",
          title: "Когда брать NoSQL",
          lessons: [
            {
              id: "when-nosql",
              kind: "READING",
              title: "SQL или NoSQL?",
              xp: 10,
              estMin: 8,
              body:
                "# Когда нужен NoSQL\n\n" +
                "## SQL по умолчанию\n\nДля 95% backend-задач Postgres — лучший выбор. JSONB закрывает почти все аргументы «нужна гибкая схема».\n\n" +
                "## Когда NoSQL\n\n- **Очень большие объёмы** — миллиарды записей, шардинг из коробки → Cassandra, ScyllaDB\n- **Граф связей** — соцсети, рекомендации → Neo4j\n- **Полнотекстовый поиск** → Elasticsearch, Meilisearch\n- **Time-series** — метрики, IoT → InfluxDB, TimescaleDB\n- **Кэш и сессии** → Redis\n- **Документы со сложной структурой и без жёстких связей** → MongoDB\n\n" +
                "## CAP-теорема\n\nИз трёх — Consistency, Availability, Partition tolerance — в распределённой системе можно гарантировать только два. Postgres = CP, Cassandra = AP, MongoDB настраивается.",
            },
            {
              id: "mongo-basics",
              kind: "READING",
              title: "MongoDB основы",
              xp: 12,
              estMin: 10,
              body:
                "# MongoDB\n\n" +
                "## Модель\n\n" +
                "Коллекции (≈ таблицы) → документы (≈ строки, JSON-объекты).\n\n" +
                "```js\ndb.users.insertOne({\n  email: 'a@b.com',\n  profile: { name: 'Ada', age: 30 },\n  tags: ['admin', 'beta'],\n});\n```\n\n" +
                "## Запросы\n\n" +
                "```js\ndb.users.find({ 'profile.age': { $gte: 18 }, tags: 'admin' });\ndb.users.updateOne({ email }, { $set: { 'profile.age': 31 } });\ndb.users.aggregate([\n  { $match: { country: 'RU' } },\n  { $group: { _id: '$country', count: { $sum: 1 } } },\n]);\n```\n\n" +
                "## Индексы\n\n```js\ndb.users.createIndex({ email: 1 }, { unique: true });\ndb.users.createIndex({ 'profile.age': 1, country: 1 });\n```\n\n" +
                "## Когда брать\n\nКогда документы реально не нормализуются (вложенные структуры разной формы) и связи редки.",
            },
            {
              id: "redis-cache",
              kind: "READING",
              title: "Redis как кэш",
              xp: 14,
              estMin: 10,
              body:
                "# Redis для кэширования\n\n" +
                "## Базовые команды\n\n" +
                "```bash\nSET user:42 '{\"name\":\"Ada\"}' EX 3600  # с TTL 1 час\nGET user:42\nDEL user:42\nINCR counter:visits                       # атомарный счётчик\n```\n\n" +
                "## Паттерны кэша\n\n" +
                "**Cache-aside (lazy):**\n```ts\nasync function getUser(id) {\n  const cached = await redis.get(`user:${id}`);\n  if (cached) return JSON.parse(cached);\n  const u = await db.user.findById(id);\n  await redis.set(`user:${id}`, JSON.stringify(u), 'EX', 600);\n  return u;\n}\n```\n\n" +
                "**Write-through** — при апдейте обновляем и БД, и кэш.\n\n**Write-behind** — пишем в кэш, в БД асинхронно (риск потери данных).\n\n" +
                "## Главные грабли\n\n" +
                "- **Cache stampede** — кэш протух, 1000 запросов одновременно идут в БД. Лечение: лок (`SET NX`), вероятностное обновление до истечения\n" +
                "- **Stale data** — забыли инвалидировать. Лечение: короткий TTL + invalidate at write\n- **Hot keys** — все ходят за одним ключом, реплика перегружена. Шардирование, локальный in-memory cache",
            },
            {
              id: "redis-streams",
              kind: "READING",
              title: "Redis pub/sub и streams",
              xp: 14,
              estMin: 10,
              body:
                "# Redis помимо кэша\n\n" +
                "## Pub/Sub\n\n" +
                "```ts\n// publisher\nawait redis.publish('chat:42', JSON.stringify({ msg: 'hi' }));\n\n// subscriber\nconst sub = redis.duplicate();\nawait sub.subscribe('chat:42');\nsub.on('message', (channel, msg) => { /* ... */ });\n```\n\n" +
                "Простой бродкаст. **Без гарантий доставки** — если подписчик offline, сообщение пропало.\n\n" +
                "## Streams (Redis 5+)\n\n" +
                "Долговечный лог сообщений с consumer groups (как Kafka, но проще):\n\n" +
                "```bash\nXADD events * type signup userId 42\nXREADGROUP GROUP workers w1 COUNT 10 BLOCK 5000 STREAMS events >\n```\n\n" +
                "## Что использовать\n\n- **Pub/Sub** — типизированные нотификации в реалтайме (websocket fanout)\n- **Streams** — фоновые задачи, события для нескольких воркеров\n- **BullMQ** (поверх streams) — очереди задач для бэкенда",
            },
            {
              id: "redis-rate-limit-project",
              kind: "PROJECT",
              title: "Проект: rate limiter на Redis",
              xp: 80,
              estMin: 40,
              body:
                "# Проект: rate limiter middleware\n\n" +
                "Сделай middleware для Fastify, который ограничивает запросы по IP.\n\n" +
                "## Требования\n\n- Алгоритм: sliding window log (массив timestamp'ов в Redis sorted set)\n- 100 запросов за минуту по умолчанию, конфигурируется\n- Возвращает 429 Too Many Requests + Retry-After\n- Атомарность через `MULTI/EXEC` или Lua-скрипт\n\n" +
                "## Подсказка\n\n```\nZADD key now now\nZREMRANGEBYSCORE key 0 (now-60s)\nZCARD key\nEXPIRE key 60\n```\n\n" +
                "Это всё в одном Lua-скрипте — атомарно и быстро.",
            },
          ],
        },
      ],
    },
  ],
};
