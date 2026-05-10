# BackendMasters

> Полный курс backend-инженерии — от нуля до Senior Backend Engineer со знанием Docker.
> Клиентское приложение, прогресс хранится локально, работает с телефона и офлайн.

## Что это

Интерактивный самоучитель: **~190 уроков** по 6 уровням, реальный фокус на **Docker**, **базах данных** и **system design**. Никакого бэкенда — всё работает в браузере.

- 📱 Адаптивная вёрстка для iPhone / Android / Desktop
- 💾 Прогресс хранится в `localStorage`, имя в cookie
- 🧪 Песочница с реальным исполнением JS в Web Worker (тайм-аут 5с)
- 🌑 Тёмная glassmorphism-тема с анимациями
- 🚫 Без регистрации, без сервера, без оплаты — статический сайт

## Программа

| Уровень | Тема | Курсов | Уроков | Часов |
|---------|------|--------|--------|-------|
| L1 | Основы (JS, TS, Node.js) | 4 | ~25 | 16 |
| L2 | HTTP, API, GraphQL, gRPC, безопасность | 5 | ~30 | 22 |
| L3 | Базы данных | 4 | ~20 | 16 |
| **L4** | **Docker от и до + advanced/debug** | **6** | **~35** | **26** |
| L5 | Senior Backend (тесты, scaling, K8s, system design) | 6 | ~30 | 24 |
| **L6** | **Прод-инжиниринг: Linux, Git, AWS, K8s deep, перфоманс, микросервисы, security** | **7** | **~38** | **28** |

**~190 уроков, ~130 часов** реальной практики. После прохождения — ты готов к Senior/Staff Backend Engineer позиции с доменной экспертизой по Docker, K8s, AWS и system design.

## Запустить локально

```bash
pnpm install
pnpm dev
```

Открой http://localhost:3000.

## Билд для прода

```bash
pnpm build
pnpm start
```

Можно деплоить на **Vercel**, **Netlify**, **Cloudflare Pages** одним кликом — это просто Next.js без сервера.

## Структура

```
.
├── apps/web/                  Next.js 15 + Tailwind + Zustand
│   ├── src/
│   │   ├── app/               страницы (App Router)
│   │   │   ├── page.tsx           лендинг
│   │   │   ├── roadmap/           карта обучения
│   │   │   ├── courses/           список курсов и страница курса
│   │   │   ├── lessons/[id]/      страница урока (READING/QUIZ/CODE/PROJECT/INTERVIEW)
│   │   │   ├── dashboard/         личный прогресс
│   │   │   ├── playground/        Web Worker песочница
│   │   │   ├── leaderboard/       симулированный рейтинг
│   │   │   └── profile/           профиль (cookie-имя, сброс)
│   │   ├── components/        Navbar, MobileTabs, Markdown, CodeEditor
│   │   ├── curriculum/        ⭐ ВЕСЬ КОНТЕНТ КУРСА
│   │   │   ├── types.ts
│   │   │   ├── level-1.ts         основы (JS/TS/Node)
│   │   │   ├── level-2.ts         HTTP / API / GraphQL / gRPC / OpenAPI
│   │   │   ├── level-3.ts         БД
│   │   │   ├── level-4.ts         Docker + Docker advanced/debug
│   │   │   ├── level-5.ts         Senior (тесты, observability, scaling, K8s, system design)
│   │   │   ├── level-6.ts         Прод-инжиниринг (Linux, Git, AWS, K8s deep, perf, microservices, security)
│   │   │   └── index.ts           сборщик + утилиты
│   │   ├── store/             Zustand
│   │   │   ├── progress.ts        XP, серия, уроки, ачивки → localStorage
│   │   │   └── profile.ts         имя → cookie
│   │   └── lib/
│   │       ├── cookies.ts         get/set/delete cookies
│   │       └── utils.ts
│   └── public/                manifest.json, icon.svg
├── docs/                      руководства из предыдущей версии
├── package.json               (pnpm workspace)
└── pnpm-workspace.yaml
```

## Как добавить уроки

Открой `apps/web/src/curriculum/level-X.ts`, добавь lesson в нужный module:

```ts
{
  id: "unique-id",
  kind: "READING" | "QUIZ" | "CODE" | "PROJECT" | "INTERVIEW",
  title: "Название",
  body: "# Markdown содержимое\n\nможет быть длинным",
  xp: 15,
  estMin: 10,
  // для QUIZ:
  payload: { questions: [{ q, options, correct, explanation? }] },
  // для CODE:
  payload: { starter: "...", mustContain: ["foo"], mustNotContain: ["eval("], hint: "..." },
}
```

Перезапусти dev — урок появится. Прогресс существующих пользователей не сломается (localStorage версионирован: `bm_progress_v1`).

## Как очистить свой прогресс

Профиль → «Опасная зона» → Сбросить весь прогресс. Или вручную в DevTools:

```js
localStorage.removeItem("bm_progress_v1");
document.cookie = "bm_profile=; Max-Age=0; Path=/";
```

## Стек

- **Next.js 15** (App Router, RSC отключён для интерактивных страниц)
- **TypeScript** strict + `noUncheckedIndexedAccess`
- **Tailwind CSS** + custom dark glass theme
- **Framer Motion** для анимаций
- **Zustand** + `persist` middleware для localStorage
- **Monaco Editor** для кодовых задач и песочницы
- **react-markdown** + remark-gfm для тел уроков

## Лицензия

MIT.
