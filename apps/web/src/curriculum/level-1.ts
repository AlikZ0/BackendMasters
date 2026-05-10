import type { Track } from "./types";

export const LEVEL_1: Track = {
  id: "l1-foundations",
  level: "BEGINNER",
  title: "Уровень 1 — Основы",
  description:
    "JavaScript, TypeScript, Node.js — фундамент, без которого backend не построить.",
  hours: 16,
  courses: [
    // ───────────────────────────────────────────────────────
    {
      id: "js-for-backend",
      emoji: "🟨",
      title: "JavaScript для backend",
      description: "Типы, функции, объекты, прототипы — то, что реально нужно на сервере.",
      modules: [
        {
          id: "js-core",
          title: "Ядро языка",
          lessons: [
            {
              id: "js-types",
              kind: "READING",
              title: "Типы, переменные, операторы",
              xp: 10,
              estMin: 8,
              body:
                "# Типы и переменные\n\n" +
                "В JavaScript семь примитивов: `string`, `number`, `bigint`, `boolean`, `null`, `undefined`, `symbol` — и всё остальное это объекты (включая массивы и функции).\n\n" +
                "## let, const, var\n\n" +
                "- `const` — для всего, что не переприсваивается. Это **дефолт**.\n" +
                "- `let` — когда правда нужно перезаписать.\n" +
                "- `var` — забудь, что это слово существует.\n\n" +
                "```js\nconst userId = 42;          // ссылка не меняется\nconst user = { name: \"Alex\" };\nuser.name = \"Alex Prime\"; // объект мутировать можно\n```\n\n" +
                "## Странности, о которых спросят\n\n" +
                "- `typeof null === \"object\"` — историческая баг-фича.\n" +
                "- `0.1 + 0.2 !== 0.3` — IEEE-754, всегда сравнивай с эпсилон.\n" +
                "- `[] + [] === \"\"` — приведение типов делает странное. Пиши `=== ` вместо `==` и не делай арифметику с массивами.\n\n" +
                "## Главное\n\nНа бэкенде ты работаешь с JSON, а JSON — это подмножество JS-литералов. Чем точнее ты помнишь типы и приведения, тем меньше багов в API.",
            },
            {
              id: "js-functions",
              kind: "READING",
              title: "Функции, замыкания, this",
              xp: 12,
              estMin: 10,
              body:
                "# Функции — главный примитив JS\n\n" +
                "Функция — объект первого класса. Её можно передать, вернуть, положить в массив.\n\n" +
                "## Декларация vs выражение vs стрелка\n\n" +
                "```js\nfunction add(a, b) { return a + b; }    // hoisted\nconst sub = function (a, b) { return a - b; }; // не hoisted\nconst mul = (a, b) => a * b;            // короткая, без своего this\n```\n\n" +
                "## Замыкания\n\nФункция помнит лексическое окружение, в котором она была создана.\n\n" +
                "```js\nfunction counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = counter();\nnext(); // 1\nnext(); // 2\n```\n\n" +
                "Это база для middleware, кэшей, мемоизации, rate-limiter'ов.\n\n" +
                "## this\n\n" +
                "- В стрелке `this` берётся из внешнего скоупа.\n" +
                "- В обычной функции — определяется тем, КАК её вызвали.\n" +
                "- На сервере (Node.js) `this` в верхнем уровне модуля = `{}` (не глобальный объект).\n\n" +
                "На бэкенде ты редко пишешь `this` руками — почти всегда стрелки или функции верхнего уровня.",
            },
            {
              id: "js-objects",
              kind: "READING",
              title: "Объекты, классы, прототипы",
              xp: 12,
              estMin: 10,
              body:
                "# Объекты и классы\n\n" +
                "## Литералы\n\n" +
                "```js\nconst user = {\n  id: 1,\n  name: \"Ada\",\n  greet() { return `Hi, ${this.name}`; },\n};\n```\n\n" +
                "## Деструктуризация — обязательная привычка\n\n" +
                "```js\nfunction createUser({ email, password, role = \"user\" }) {\n  // ...\n}\n```\n\n" +
                "## Классы\n\n" +
                "```ts\nclass UserService {\n  constructor(private repo: UserRepo) {}\n  findById(id: string) { return this.repo.findOne(id); }\n}\n```\n\n" +
                "Классы в Node.js используются точечно — для сервисов, контроллеров, ошибок (extend Error). Большую часть времени ты пишешь чистые функции.\n\n" +
                "## Прототипы\n\nКаждый объект имеет `__proto__`. Когда ищешь свойство, JS поднимается по цепочке. На бэкенде это всплывает в трёх местах:\n\n" +
                "- `Object.create(null)` — словарь без `__proto__` (защита от prototype pollution)\n" +
                "- `instanceof` — проверка по цепочке\n" +
                "- ошибки — `class MyError extends Error` работает через прототипы",
            },
            {
              id: "js-quiz-1",
              kind: "QUIZ",
              title: "Тест: ядро JavaScript",
              xp: 25,
              estMin: 5,
              body: "Проверь, что усвоил основы.",
              payload: {
                questions: [
                  {
                    q: "Что вернёт typeof null?",
                    options: ["\"null\"", "\"object\"", "\"undefined\"", "ошибку"],
                    correct: "\"object\"",
                    explanation: "Историческая бага языка, оставлена для совместимости.",
                  },
                  {
                    q: "Какое ключевое слово нужно использовать по умолчанию?",
                    options: ["var", "let", "const", "any"],
                    correct: "const",
                    explanation: "const — дефолт; let только когда нужно переприсваивание.",
                  },
                  {
                    q: "Чему равно 0.1 + 0.2?",
                    options: ["0.3", "0.30000000000000004", "0", "NaN"],
                    correct: "0.30000000000000004",
                    explanation: "Двоичные дроби IEEE-754 не точно представляют десятичные.",
                  },
                  {
                    q: "Что такое замыкание?",
                    options: [
                      "функция, которая сама себя вызывает",
                      "функция + её лексическое окружение",
                      "приватный метод класса",
                      "способ закрытия соединения с БД",
                    ],
                    correct: "функция + её лексическое окружение",
                  },
                ],
              },
            },
            {
              id: "js-code-fp",
              kind: "CODE",
              title: "Код: реализуй reduce",
              xp: 35,
              estMin: 10,
              body:
                "Напиши функцию `myReduce(arr, fn, init)`, которая ведёт себя как `Array.prototype.reduce`.\n\n" +
                "Пример: `myReduce([1,2,3], (a,b) => a+b, 0) === 6`.",
              payload: {
                starter:
                  "function myReduce(arr, fn, init) {\n  // твой код\n}\n\nconsole.log(myReduce([1,2,3,4], (a,b) => a+b, 0)); // 10\n",
                mustContain: ["function myReduce", "return"],
                mustNotContain: [".reduce("],
                hint: "Используй обычный for-цикл и аккумулятор init.",
              },
            },
          ],
        },
      ],
    },
    // ───────────────────────────────────────────────────────
    {
      id: "async-js",
      emoji: "⏳",
      title: "Асинхронность",
      description: "Event loop, Promises, async/await — без этого Node.js не понять.",
      modules: [
        {
          id: "event-loop",
          title: "Event Loop",
          lessons: [
            {
              id: "what-is-event-loop",
              kind: "READING",
              title: "Что такое Event Loop",
              xp: 15,
              estMin: 12,
              body:
                "# Event Loop в Node.js\n\n" +
                "Node однопоточный по JS-коду, но **многопоточный под капотом** через libuv. Event loop — это бесконечный цикл, который:\n\n" +
                "1. Берёт колбэк из очереди\n" +
                "2. Выполняет его до конца (run-to-completion)\n" +
                "3. Опустошает очередь микротасков\n" +
                "4. Идёт на следующую фазу\n\n" +
                "## Фазы\n\n" +
                "```\n┌───────────────────┐\n│   timers          │ setTimeout, setInterval\n├───────────────────┤\n│   pending callbacks│ системные I/O колбэки\n├───────────────────┤\n│   poll            │ I/O события (HTTP, файлы)\n├───────────────────┤\n│   check           │ setImmediate\n├───────────────────┤\n│   close           │ socket.on(\"close\")\n└───────────────────┘\n```\n\n" +
                "Между фазами всегда выполняются микротаски (Promises, queueMicrotask).\n\n" +
                "## Главный вывод\n\n" +
                "Любая **синхронная** тяжёлая работа блокирует всё. Один тяжёлый цикл на 500 мс = твой сервер не отвечает 500 мс никому. Решения: разбить, отдать в Worker Thread, в воркер-процесс через очередь.",
            },
            {
              id: "promises",
              kind: "READING",
              title: "Promises с нуля",
              xp: 12,
              estMin: 10,
              body:
                "# Promises\n\n" +
                "Promise — объект с тремя состояниями: `pending`, `fulfilled`, `rejected`.\n\n" +
                "```js\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve(42), 100);\n});\np.then(v => console.log(v)); // 42\n```\n\n" +
                "## Цепочки\n\n" +
                "```js\nfetch(url)\n  .then(r => r.json())\n  .then(data => process(data))\n  .catch(err => log.error(err));\n```\n\n" +
                "## Параллель vs последовательность\n\n" +
                "```js\n// последовательно — медленно\nconst a = await getA();\nconst b = await getB();\n\n// параллельно — быстро\nconst [a, b] = await Promise.all([getA(), getB()]);\n```\n\n" +
                "## Полезные методы\n\n" +
                "- `Promise.all` — ждёт все, падает на первой ошибке\n" +
                "- `Promise.allSettled` — ждёт все, не падает\n" +
                "- `Promise.race` — первый победил\n" +
                "- `Promise.any` — первый успешный",
            },
            {
              id: "async-await",
              kind: "READING",
              title: "async / await",
              xp: 10,
              estMin: 8,
              body:
                "# async / await\n\n" +
                "Сахар над промисами. Делает асинхронный код похожим на синхронный.\n\n" +
                "```js\nasync function getUser(id) {\n  const u = await db.user.findById(id);\n  if (!u) throw new NotFound();\n  return u;\n}\n```\n\n" +
                "## Правила\n\n" +
                "- Каждая `async` функция возвращает Promise.\n" +
                "- `await` распаковывает Promise или возвращает значение как есть.\n" +
                "- Ошибки ловятся обычным `try/catch`.\n\n" +
                "## Антипаттерн — sequential await в цикле\n\n" +
                "```js\n// плохо — N запросов последовательно\nfor (const id of ids) {\n  await save(id);\n}\n\n// хорошо — параллельно\nawait Promise.all(ids.map(save));\n```\n\n" +
                "Но если каждый шаг зависит от предыдущего — оставляй последовательно.",
            },
            {
              id: "microtasks",
              kind: "READING",
              title: "Микро- и макротаски",
              xp: 12,
              estMin: 10,
              body:
                "# Микро vs макро\n\n" +
                "**Микротаски** (Promise.then, queueMicrotask, process.nextTick) выполняются **до** следующей макротаски.\n\n" +
                "```js\nsetTimeout(() => console.log(\"timeout\"), 0);\nPromise.resolve().then(() => console.log(\"promise\"));\nconsole.log(\"sync\");\n\n// sync\n// promise\n// timeout\n```\n\n" +
                "## process.nextTick\n\nВыполняется ДО любых других микротасков. Использовать осторожно — можно заморить event loop.\n\n" +
                "```js\nprocess.nextTick(() => console.log(\"first\"));\nPromise.resolve().then(() => console.log(\"second\"));\n// first, second\n```\n\n" +
                "На собесах любят давать порядок логов в коде с разными асинхронами.",
            },
            {
              id: "async-quiz",
              kind: "QUIZ",
              title: "Тест: асинхронность",
              xp: 25,
              estMin: 5,
              body: "Проверь свою модель event loop'а.",
              payload: {
                questions: [
                  {
                    q: "Сколько потоков выполняет JS-код в Node.js по умолчанию?",
                    options: ["1", "Зависит от CPU", "8", "Бесконечно"],
                    correct: "1",
                  },
                  {
                    q: "Что выполнится первым: Promise.then или setTimeout(0)?",
                    options: ["Promise.then", "setTimeout(0)", "Одновременно", "Зависит от Node"],
                    correct: "Promise.then",
                    explanation: "Микротаски выполняются до макротасок (таймеров).",
                  },
                  {
                    q: "Что вернёт async function, если в ней нет await?",
                    options: ["синхронное значение", "Promise", "undefined", "ошибку"],
                    correct: "Promise",
                  },
                  {
                    q: "Какой метод Promise НЕ падает на первой ошибке?",
                    options: ["Promise.all", "Promise.allSettled", "Promise.race", "Promise.any"],
                    correct: "Promise.allSettled",
                  },
                ],
              },
            },
            {
              id: "async-code-parallel",
              kind: "CODE",
              title: "Код: параллельная загрузка",
              xp: 35,
              estMin: 10,
              body:
                "Напиши функцию `fetchAll(urls)`, которая параллельно делает fetch и возвращает массив результатов в том же порядке.\n\n" +
                "Используй `Promise.all`.",
              payload: {
                starter:
                  "async function fetchAll(urls) {\n  // твой код\n}\n",
                mustContain: ["Promise.all", "async function fetchAll"],
                hint: "Promise.all(urls.map(u => fetch(u).then(r => r.json())))",
              },
            },
          ],
        },
      ],
    },
    // ───────────────────────────────────────────────────────
    {
      id: "node-core",
      emoji: "🟩",
      title: "Node.js Core",
      description: "V8, libuv, модули, файлы, потоки — всё, что бэкендеру нужно знать о среде.",
      modules: [
        {
          id: "node-runtime",
          title: "Среда выполнения",
          lessons: [
            {
              id: "what-is-node",
              kind: "READING",
              title: "Что такое Node.js",
              xp: 10,
              estMin: 8,
              body:
                "# Node.js под капотом\n\n" +
                "Node = **V8** (JS-движок Chrome) + **libuv** (асинхронный I/O для C/C++) + набор стандартных модулей.\n\n" +
                "## Ключевые куски\n\n" +
                "- **V8** — компилирует JS в машинный код, делает GC.\n" +
                "- **libuv** — пул потоков для файловой системы, DNS, криптографии. Это и есть «асинхронность» Node.js.\n" +
                "- **Bindings** — C++ обёртки, которые мостят JS-функции к OS API.\n\n" +
                "## Когда Node.js — твой выбор\n\n" +
                "+ Много I/O, мало CPU (API, чаты, прокси, оркестрация)\n" +
                "+ Реалтайм (WebSockets)\n" +
                "+ Один язык на фронте и бэке\n\n" +
                "## Когда НЕ твой\n\n" +
                "- Тяжёлый CPU без возможности выгрузить в воркер (видеообработка, heavy ML)\n" +
                "- Жёсткий реалтайм с микросекундными SLA",
            },
            {
              id: "modules",
              kind: "READING",
              title: "Модульная система: CommonJS vs ESM",
              xp: 12,
              estMin: 10,
              body:
                "# CommonJS vs ESM\n\n" +
                "## CommonJS (старый, дефолт в `node_modules`)\n\n" +
                "```js\n// math.cjs\nmodule.exports = { add: (a, b) => a + b };\n\n// app.cjs\nconst { add } = require(\"./math.cjs\");\n```\n\n" +
                "Синхронный, динамический, отлично работает в Node.\n\n" +
                "## ESM (стандарт JS)\n\n" +
                "```js\n// math.mjs\nexport const add = (a, b) => a + b;\n\n// app.mjs\nimport { add } from \"./math.mjs\";\n```\n\n" +
                "Асинхронный, статический, поддерживает tree-shaking.\n\n" +
                "## Как переключиться\n\nВ `package.json` поставь `\"type\": \"module\"` — и весь проект будет ESM. Дальше:\n" +
                "- импортируешь файлы с расширением (`import \"./x.js\"`)\n" +
                "- нет `__dirname` — используй `import.meta.url`\n" +
                "- нет `require` — используй `createRequire(import.meta.url)` если очень надо\n\n" +
                "Современные проекты пишут на ESM. Все примеры в этом курсе — ESM.",
            },
            {
              id: "npm-package",
              kind: "READING",
              title: "npm и package.json",
              xp: 10,
              estMin: 8,
              body:
                "# package.json — паспорт проекта\n\n" +
                "```json\n{\n  \"name\": \"my-api\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": { \"dev\": \"tsx watch src/server.ts\" },\n  \"dependencies\": { \"fastify\": \"^5.0.0\" },\n  \"devDependencies\": { \"typescript\": \"^5.6.0\" },\n  \"engines\": { \"node\": \">=20\" }\n}\n```\n\n" +
                "## dependencies vs devDependencies\n\n" +
                "- `dependencies` — нужно в проде\n" +
                "- `devDependencies` — нужно только при разработке (TypeScript, тесты, eslint)\n\n" +
                "## Семантические версии\n\n" +
                "- `^5.0.0` — любые 5.x.x\n" +
                "- `~5.0.0` — любые 5.0.x\n" +
                "- `5.0.0` — точно эта\n\n" +
                "## npm vs pnpm vs yarn\n\n" +
                "- **pnpm** — быстрый, экономит диск (hard-links), отлично для монорепо. Дефолт для современных проектов.\n" +
                "- **npm** — встроен, медленнее, ест больше места.\n" +
                "- **yarn** — почти умер, не выбирай для новых проектов.",
            },
            {
              id: "node-stdlib",
              kind: "READING",
              title: "fs, path, os, process",
              xp: 12,
              estMin: 10,
              body:
                "# Стандартные модули Node\n\n" +
                "## fs/promises — файлы\n\n" +
                "```js\nimport { readFile, writeFile } from \"node:fs/promises\";\n\nconst data = await readFile(\"config.json\", \"utf8\");\nawait writeFile(\"out.txt\", \"hello\");\n```\n\n" +
                "Всегда используй `node:fs/promises` (промисы) и явный `\"utf8\"`. Не путай с устаревшим колбэк-API.\n\n" +
                "## path — пути\n\n" +
                "```js\nimport { join, resolve, dirname } from \"node:path\";\nimport { fileURLToPath } from \"node:url\";\n\nconst __dirname = dirname(fileURLToPath(import.meta.url));\nconst configPath = join(__dirname, \"config.json\");\n```\n\n" +
                "Никогда не склеивай пути через `+`. Используй `join` — кросс-платформенно.\n\n" +
                "## process — окружение\n\n" +
                "```js\nconsole.log(process.env.NODE_ENV);\nprocess.on(\"SIGTERM\", () => shutdown());\nprocess.exit(1);\n```\n\n" +
                "Все секреты — через `process.env`. Никогда не хардкодь токены в коде.\n\n" +
                "## os — система\n\n" +
                "```js\nimport { cpus, totalmem, freemem } from \"node:os\";\nconsole.log(cpus().length, totalmem());\n```",
            },
            {
              id: "streams",
              kind: "READING",
              title: "Streams и буферы",
              xp: 15,
              estMin: 12,
              body:
                "# Streams\n\n" +
                "Стрим — поток данных, который ты можешь обрабатывать чанками, не загружая всё в память.\n\n" +
                "## Зачем\n\n" +
                "Файл на 5 GB? Прочитать целиком в память — твой контейнер взорвётся. Стрим читает по 64 КБ, обрабатывает, пишет.\n\n" +
                "## Четыре типа\n\n" +
                "- **Readable** — источник (`fs.createReadStream`, HTTP request)\n" +
                "- **Writable** — приёмник (`fs.createWriteStream`, HTTP response)\n" +
                "- **Duplex** — оба (TCP socket)\n" +
                "- **Transform** — Duplex с преобразованием (gzip, шифрование)\n\n" +
                "## Pipe\n\n" +
                "```js\nimport { createReadStream, createWriteStream } from \"node:fs\";\nimport { createGzip } from \"node:zlib\";\nimport { pipeline } from \"node:stream/promises\";\n\nawait pipeline(\n  createReadStream(\"big.log\"),\n  createGzip(),\n  createWriteStream(\"big.log.gz\"),\n);\n```\n\n" +
                "Всегда используй `pipeline` (с правильной обработкой ошибок), не `.pipe()` напрямую.\n\n" +
                "## Backpressure\n\nЕсли ты читаешь быстрее, чем пишешь — данные копятся в памяти. Стримы автоматически тормозят источник, если приёмник перегружен. **Это и есть главный плюс стримов** в высоконагруженных API.",
            },
            {
              id: "node-quiz",
              kind: "QUIZ",
              title: "Тест: Node.js core",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Что отвечает за асинхронный I/O в Node.js?",
                    options: ["V8", "libuv", "Web API", "Crypto"],
                    correct: "libuv",
                  },
                  {
                    q: "Какой пакетный менеджер экономит место через hard-links?",
                    options: ["npm", "yarn", "pnpm", "bun"],
                    correct: "pnpm",
                  },
                  {
                    q: "Как правильно получить __dirname в ESM?",
                    options: [
                      "просто использовать __dirname",
                      "dirname(fileURLToPath(import.meta.url))",
                      "process.cwd()",
                      "никак",
                    ],
                    correct: "dirname(fileURLToPath(import.meta.url))",
                  },
                  {
                    q: "Зачем нужен pipeline вместо .pipe()?",
                    options: [
                      "он быстрее",
                      "корректно обрабатывает ошибки и закрытие",
                      "поддерживает gzip",
                      "его требует TypeScript",
                    ],
                    correct: "корректно обрабатывает ошибки и закрытие",
                  },
                ],
              },
            },
            {
              id: "node-cli-project",
              kind: "PROJECT",
              title: "Проект: CLI-утилита подсчёта строк",
              xp: 80,
              estMin: 30,
              body:
                "# Проект: wc-clone\n\n" +
                "Сделай CLI-утилиту на Node.js, которая принимает путь к файлу и печатает количество строк, слов и байтов.\n\n" +
                "## Требования\n\n" +
                "- Запускается как `node wc.js <file>`\n" +
                "- Использует **streams** (не `readFileSync`)\n" +
                "- Печатает три числа через таб: строки, слова, байты\n" +
                "- Корректно обрабатывает отсутствие файла\n\n" +
                "## Как чекать\n\nСравни с системным `wc` на каком-нибудь файле — числа должны совпасть.\n\n" +
                "Это маленькая, но настоящая боевая задача: ты учишься читать большие файлы без памяти.",
            },
          ],
        },
      ],
    },
    // ───────────────────────────────────────────────────────
    {
      id: "ts-for-backend",
      emoji: "🟦",
      title: "TypeScript для backend",
      description: "Типы — твой первый фильтр багов. Без них в команде не выживешь.",
      modules: [
        {
          id: "ts-basics",
          title: "Основы TS",
          lessons: [
            {
              id: "ts-why",
              kind: "READING",
              title: "Зачем TypeScript",
              xp: 10,
              estMin: 7,
              body:
                "# Почему TS — стандарт для backend\n\n" +
                "1. **Ловит баги при компиляции**, а не в проде в 3 ночи\n" +
                "2. **Автокомплит** в IDE — экономит часы\n" +
                "3. **Рефакторинг безопасен** — переименовал поле, и компилятор покажет 30 мест\n" +
                "4. **Документация в коде** — типы заменяют половину комментариев\n\n" +
                "## Что говорят те, кто против\n\n" +
                "«Лишний шаг сборки.» — да, ровно один npm-пакет.\n" +
                "«Любые any портят всё.» — потому и не пишем `any`.\n\n" +
                "## TS != проверка в рантайме\n\nКомпилятор удаляет типы. В проде твой объект может прийти любым. Поэтому **на границах** (HTTP-входы, файлы, БД) — валидируй через **Zod** или подобное.",
            },
            {
              id: "ts-types",
              kind: "READING",
              title: "Базовые типы и интерфейсы",
              xp: 12,
              estMin: 10,
              body:
                "# Типы\n\n" +
                "## Примитивы\n\n" +
                "```ts\nlet age: number = 30;\nlet name: string = \"Ada\";\nlet on: boolean = true;\nlet ids: number[] = [1, 2, 3];\nlet tuple: [string, number] = [\"hp\", 100];\n```\n\n" +
                "## Объекты\n\n" +
                "```ts\ninterface User {\n  id: string;\n  email: string;\n  age?: number; // опционально\n  readonly createdAt: Date;\n}\n```\n\n" +
                "## type vs interface\n\n" +
                "Оба нормальные. `type` гибче (union, intersection, mapped). `interface` лучше extend-ится. На бэкенде смело используй `interface` для публичных контрактов и `type` для всего остального.\n\n" +
                "## Union & Literal\n\n" +
                "```ts\ntype Role = \"admin\" | \"user\" | \"guest\";\ntype HttpMethod = \"GET\" | \"POST\" | \"PATCH\" | \"DELETE\";\n```\n\n" +
                "## Никогда не пиши any\n\nЕсли реально не знаешь — `unknown`. Он заставит тебя сузить тип через проверку.",
            },
            {
              id: "ts-generics",
              kind: "READING",
              title: "Generics",
              xp: 15,
              estMin: 12,
              body:
                "# Generics\n\n" +
                "Дженерики позволяют писать функции и типы, которые работают с любым типом, **сохраняя информацию о нём**.\n\n" +
                "```ts\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst x = first([1, 2, 3]); // x: number | undefined\nconst y = first([\"a\"]);     // y: string | undefined\n```\n\n" +
                "## Constraints\n\n" +
                "```ts\nfunction byId<T extends { id: string }>(items: T[], id: string): T | undefined {\n  return items.find(i => i.id === id);\n}\n```\n\n" +
                "## Generic-классы\n\n" +
                "```ts\nclass Repository<T extends { id: string }> {\n  constructor(private data = new Map<string, T>()) {}\n  save(item: T) { this.data.set(item.id, item); }\n  find(id: string): T | undefined { return this.data.get(id); }\n}\n```\n\n" +
                "На бэкенде дженерики чаще всего встречаются в репозиториях, обработчиках HTTP, в обёртках вокруг БД (Prisma, Knex).",
            },
            {
              id: "ts-utility",
              kind: "READING",
              title: "Utility types",
              xp: 12,
              estMin: 10,
              body:
                "# Утилитные типы — экономят километры кода\n\n" +
                "```ts\ninterface User {\n  id: string;\n  email: string;\n  password: string;\n  createdAt: Date;\n}\n\ntype PublicUser = Omit<User, \"password\">;\ntype CreateUserDto = Pick<User, \"email\" | \"password\">;\ntype PartialUser = Partial<User>;             // все поля опциональны\ntype RequiredUser = Required<PartialUser>;    // обратное\ntype UserMap = Record<string, User>;          // словарь\ntype Email = User[\"email\"];                   // string\n```\n\n" +
                "## Свои утилиты\n\n" +
                "```ts\ntype Nullable<T> = T | null;\ntype AsyncReturn<T extends (...a: any[]) => Promise<unknown>> = Awaited<ReturnType<T>>;\n```\n\n" +
                "## NonNullable, ReturnType, Parameters\n\nВсегда выводи типы из существующих, не дублируй вручную. Если интерфейс меняется — все производные типы обновятся сами.",
            },
            {
              id: "ts-tsconfig",
              kind: "READING",
              title: "tsconfig: что включить, что выключить",
              xp: 12,
              estMin: 10,
              body:
                "# tsconfig для backend\n\n" +
                "Стартовый набор для серверного TS:\n\n" +
                "```json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"Bundler\",\n    \"strict\": true,\n    \"noUncheckedIndexedAccess\": true,\n    \"noImplicitOverride\": true,\n    \"isolatedModules\": true,\n    \"skipLibCheck\": true,\n    \"esModuleInterop\": true\n  }\n}\n```\n\n" +
                "## Разбор флагов\n\n" +
                "- `strict` — включает 8 строгих проверок. **Всегда true.**\n" +
                "- `noUncheckedIndexedAccess` — `arr[i]` теперь `T | undefined`. Спасёт от nil-крэшей.\n" +
                "- `noImplicitOverride` — обязывает писать `override` при переопределении методов.\n" +
                "- `isolatedModules` — гарантирует, что каждый файл компилируется независимо (нужно для swc/esbuild).\n" +
                "- `skipLibCheck` — не проверять типы внутри `node_modules`. Сильно ускоряет.\n\n" +
                "## Куда не emit\n\nЕсли ты используешь `tsx`/`ts-node` или собираешь через esbuild/swc — поставь `\"noEmit\": true`. Тогда tsc только тайпчекит.",
            },
            {
              id: "ts-quiz",
              kind: "QUIZ",
              title: "Тест: TypeScript",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "В рантайме TS-типы...",
                    options: ["проверяются", "удаляются при компиляции", "конвертятся в JSDoc", "сохраняются как Symbol"],
                    correct: "удаляются при компиляции",
                  },
                  {
                    q: "Чем заменить any, когда тип неизвестен?",
                    options: ["unknown", "object", "never", "null"],
                    correct: "unknown",
                  },
                  {
                    q: "Какой утилитный тип сделает все поля опциональными?",
                    options: ["Required", "Partial", "Readonly", "Pick"],
                    correct: "Partial",
                  },
                  {
                    q: "Что включает strict в tsconfig?",
                    options: [
                      "только noImplicitAny",
                      "несколько строгих проверок (Null, Any, Function...)",
                      "ESLint",
                      "форматирование",
                    ],
                    correct: "несколько строгих проверок (Null, Any, Function...)",
                  },
                ],
              },
            },
            {
              id: "ts-result-code",
              kind: "CODE",
              title: "Код: типизированный Result",
              xp: 40,
              estMin: 12,
              body:
                "Реализуй тип `Result<T, E>` с тэгированным union'ом и хелперы `ok`, `err`.\n\n" +
                "Должно работать так:\n```ts\nconst r = ok(42);\nif (r.ok) console.log(r.value);\n```",
              payload: {
                starter:
                  "type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };\n\nfunction ok<T>(value: T): Result<T, never> {\n  // твой код\n}\n\nfunction err<E>(error: E): Result<never, E> {\n  // твой код\n}\n",
                mustContain: ["function ok", "function err", "return"],
                hint: "Возвращай { ok: true, value } и { ok: false, error }.",
              },
            },
          ],
        },
      ],
    },
  ],
};
