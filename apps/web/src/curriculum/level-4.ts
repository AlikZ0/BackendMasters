import type { Track } from "./types";

export const LEVEL_4: Track = {
  id: "l4-docker",
  level: "MIDDLE",
  title: "Уровень 4 — Docker от и до",
  description:
    "Контейнеры, образы, Compose, тома, сети, multi-stage сборки, продакшен — всё, что должен знать backend-инженер.",
  hours: 22,
  courses: [
    {
      id: "containers-from-scratch",
      emoji: "📦",
      title: "Контейнеры с нуля",
      description: "Что такое контейнер на самом деле. Запуск, образы, теги.",
      modules: [
        {
          id: "what-is-container",
          title: "Что такое контейнер",
          lessons: [
            {
              id: "container-vs-vm",
              kind: "READING",
              title: "Контейнер vs виртуальная машина",
              xp: 12,
              estMin: 10,
              body:
                "# Контейнер vs ВМ\n\n" +
                "## ВМ\n\nГипервизор (KVM, VMware) эмулирует целое железо. Поверх — полноценная гостевая ОС со своим ядром. Старт = минуты, размер = GB.\n\n" +
                "## Контейнер\n\nИспользует **ядро хоста**. Изоляция через **Linux namespaces** (PID, NET, MNT, USER...) и **cgroups** (CPU/RAM лимиты). Старт = миллисекунды, размер = MB.\n\n" +
                "## Что значит «контейнер не имеет своего ядра»\n\n" +
                "На macOS и Windows Docker внутри запускает **тонкую Linux-ВМ** (через WSL2 или HyperKit), потому что контейнерам нужно Linux-ядро. На Linux — нативно.\n\n" +
                "## Главные namespaces\n\n" +
                "- **PID** — процессы видят только себя (ваш процесс PID 1 в контейнере)\n- **NET** — свой сетевой стек\n- **MNT** — своя файловая система\n- **UTS** — свой hostname\n- **USER** — мэппинг user-id (контейнер думает, что он root, а на хосте обычный user)\n\n" +
                "Знание этих штук помогает дебажить «почему оно не видит файл» и «почему мы не root».",
            },
            {
              id: "install-docker",
              kind: "READING",
              title: "Установка и первая проверка",
              xp: 8,
              estMin: 5,
              body:
                "# Установка Docker\n\n" +
                "## Linux (Ubuntu/Debian)\n\n" +
                "```bash\ncurl -fsSL https://get.docker.com | sh\nsudo usermod -aG docker $USER\nnewgrp docker\n```\n\n" +
                "## macOS / Windows\n\nDocker Desktop с docker.com. Под капотом — WSL2/HyperKit.\n\n" +
                "Альтернативы Desktop'а: **Colima**, **OrbStack** (быстрее) на macOS, **Rancher Desktop**.\n\n" +
                "## Проверка\n\n" +
                "```bash\ndocker --version\ndocker compose version\ndocker run --rm hello-world\n```\n\n" +
                "Если последняя команда показала `Hello from Docker!` — всё работает.",
            },
            {
              id: "first-run",
              kind: "READING",
              title: "Первый docker run",
              xp: 12,
              estMin: 10,
              body:
                "# docker run — твой главный глагол\n\n" +
                "```bash\ndocker run -d --name web -p 8080:80 nginx:alpine\n```\n\n" +
                "Расшифровка:\n- `-d` — detached (в фоне)\n- `--name web` — имя контейнера\n- `-p 8080:80` — проброс порта хост:контейнер\n- `nginx:alpine` — образ:тег\n\n" +
                "## Полезные флаги\n\n" +
                "- `--rm` — удалить контейнер после остановки\n- `-it` — интерактивный режим (TTY) для shell\n- `-e KEY=VALUE` — переменная окружения\n- `-v ./data:/app/data` — монтировать том\n- `--network mynet` — сеть\n- `--restart unless-stopped` — автоперезапуск\n- `--memory=512m --cpus=1.5` — лимиты\n\n" +
                "## Жизненный цикл\n\n" +
                "```bash\ndocker ps                    # бегущие\ndocker ps -a                 # все, включая остановленные\ndocker logs -f web           # логи\ndocker exec -it web sh       # зайти в контейнер\ndocker stop web && docker rm web\n```",
            },
            {
              id: "images-layers",
              kind: "READING",
              title: "Образы и слои",
              xp: 14,
              estMin: 10,
              body:
                "# Образ = неизменяемый шаблон\n\n" +
                "Образ — это слоистая (Union FS) файловая система + метаданные (CMD, ENV, EXPOSE).\n\n" +
                "## Слои\n\nКаждая инструкция в Dockerfile = новый слой. Слои **кешируются** и переиспользуются между сборками и образами.\n\n" +
                "```\nFROM node:20-alpine        # слой 1 — базовый образ\nWORKDIR /app                # слой 2\nCOPY package.json .         # слой 3\nRUN npm install             # слой 4 — самый тяжёлый\nCOPY . .                    # слой 5\nCMD node server.js\n```\n\n" +
                "Если ты не менял `package.json`, слой 4 берётся из кэша. Если меняешь любой файл — слой 5 пересобирается, но `npm install` пропускается.\n\n" +
                "**Правило:** часто меняющееся — последним.\n\n" +
                "## Команды\n\n" +
                "```bash\ndocker images                       # список\ndocker pull node:20-alpine          # скачать\ndocker rmi node:20-alpine           # удалить\ndocker history my-app:1.0           # увидеть слои\ndocker inspect my-app:1.0           # все метаданные\n```\n\n" +
                "## Где живут\n\nНа Linux: `/var/lib/docker/`. Под управлением OverlayFS.",
            },
            {
              id: "tags-registries",
              kind: "READING",
              title: "Теги и реестры",
              xp: 10,
              estMin: 7,
              body:
                "# Теги\n\n" +
                "`nginx:alpine` — `nginx` это repository, `alpine` это tag.\n\n" +
                "## latest — зло\n\n`docker pull node:latest` — что прилетит, никто не знает. Завтра обновится — твой деплой сломается.\n\nИспользуй конкретные теги: `node:20.10.0-alpine`. Или хеш дайджеста: `node@sha256:abc...` для **полной** воспроизводимости.\n\n" +
                "## Реестры\n\n" +
                "- **Docker Hub** (по умолчанию)\n- **GitHub Container Registry** (`ghcr.io/<user>/<image>`)\n- **AWS ECR**, **Google Artifact Registry**\n- Свой через `registry:2` — образ Docker Registry\n\n" +
                "## Push\n\n```bash\ndocker tag my-app ghcr.io/me/my-app:1.0\ndocker login ghcr.io\ndocker push ghcr.io/me/my-app:1.0\n```",
            },
            {
              id: "docker-quiz-1",
              kind: "QUIZ",
              title: "Тест: основы Docker",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Что использует контейнер вместо своего ядра?",
                    options: ["микроядро", "ядро хоста", "ядро образа", "WebAssembly"],
                    correct: "ядро хоста",
                  },
                  {
                    q: "За изоляцию процессов отвечает...",
                    options: ["chroot", "namespaces", "cgroups", "AppArmor"],
                    correct: "namespaces",
                  },
                  {
                    q: "Что делает -p 8080:80?",
                    options: [
                      "ограничивает CPU",
                      "пробрасывает порт хоста на порт контейнера",
                      "пробрасывает порт контейнера на порт хоста",
                      "открывает оба порта",
                    ],
                    correct: "пробрасывает порт хоста на порт контейнера",
                    explanation: "Формат host:container.",
                  },
                  {
                    q: "Почему latest — плохой тег?",
                    options: [
                      "медленно качается",
                      "версия может измениться без предупреждения",
                      "не работает в проде",
                      "запрещён лицензией",
                    ],
                    correct: "версия может измениться без предупреждения",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "dockerfile",
      emoji: "📜",
      title: "Dockerfile",
      description: "Анатомия, кэш, multi-stage, best practices.",
      modules: [
        {
          id: "dockerfile-anatomy",
          title: "Анатомия и оптимизация",
          lessons: [
            {
              id: "df-instructions",
              kind: "READING",
              title: "Инструкции Dockerfile",
              xp: 14,
              estMin: 12,
              body:
                "# Инструкции — арсенал\n\n" +
                "```Dockerfile\nFROM node:20-alpine            # базовый образ\nLABEL org.opencontainers.image.source=\"https://github.com/me/repo\"\nWORKDIR /app                   # cd /app + создать если нет\nCOPY package*.json ./          # копирует с хоста в образ\nRUN npm ci                     # выполняет команду при сборке\nCOPY . .\nENV NODE_ENV=production        # переменная окружения\nEXPOSE 3000                    # документация (не открывает порт!)\nUSER node                      # сменить юзера\nHEALTHCHECK --interval=30s CMD wget -q http://localhost:3000/health || exit 1\nCMD [\"node\", \"server.js\"]      # дефолтная команда (один процесс)\n```\n\n" +
                "## CMD vs ENTRYPOINT\n\n- **CMD** — дефолтная команда, перезаписывается аргументами `docker run`\n- **ENTRYPOINT** — фиксированный exec, аргументы CMD добавляются\n\nКомбо: `ENTRYPOINT [\"node\"]` + `CMD [\"server.js\"]` → `docker run img script.js` запустит `node script.js`.\n\n" +
                "## EXPOSE — миф\n\nEXPOSE **не открывает** порт. Это просто документация. Открывает `-p` при `docker run`.",
            },
            {
              id: "df-copy-add",
              kind: "READING",
              title: "COPY vs ADD",
              xp: 8,
              estMin: 5,
              body:
                "# COPY vs ADD\n\n## COPY\n\nПростое копирование с хоста в образ. **Используй всегда его.**\n\n" +
                "## ADD\n\nКопирование + умеет:\n- разворачивать .tar архивы\n- скачивать по URL\n\nНо: магия делает Dockerfile непредсказуемым. **Не используй ADD без причины.**\n\n" +
                "Если нужно скачать — `RUN curl -fsSL ... | tar xz` явно.",
            },
            {
              id: "df-cache",
              kind: "READING",
              title: "Кэш слоёв — главный трюк",
              xp: 16,
              estMin: 12,
              body:
                "# Кэш слоёв\n\n" +
                "Docker пересобирает слой только если **что-то изменилось** в его содержимом. Если слой N невалиден — все следующие тоже.\n\n" +
                "## Плохо\n\n" +
                "```Dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY . .              # любая правка кода невалидирует следующее\nRUN npm install       # 60 секунд каждый раз!\n```\n\n" +
                "## Хорошо\n\n" +
                "```Dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./       # меняется редко\nRUN npm ci --omit=dev       # кэшируется почти всегда\nCOPY . .                    # меняется часто, но не невалидирует install\nCMD [\"node\", \"server.js\"]\n```\n\n" +
                "## .dockerignore\n\nКак .gitignore, но для Docker. **Обязательно** добавь:\n\n" +
                "```\nnode_modules\n.git\n.env\n.next\ndist\ncoverage\n*.log\nDockerfile\n.dockerignore\n```\n\n" +
                "Без него `COPY . .` скопирует твою node_modules с хоста в образ — это медленно и часто ломает сборку.",
            },
            {
              id: "df-multistage",
              kind: "READING",
              title: "Multi-stage builds",
              xp: 18,
              estMin: 14,
              body:
                "# Multi-stage builds\n\n" +
                "Идея: используй один образ для **сборки**, и более тонкий — для **рантайма**.\n\n" +
                "```Dockerfile\n# ===== build stage =====\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build         # → /app/dist\n\n# ===== runtime stage =====\nFROM node:20-alpine AS runtime\nWORKDIR /app\nENV NODE_ENV=production\nCOPY package*.json ./\nRUN npm ci --omit=dev      # только prod-зависимости\nCOPY --from=build /app/dist ./dist\nUSER node\nCMD [\"node\", \"dist/server.js\"]\n```\n\n" +
                "## Что выигрываем\n\n- Финальный образ **в 3-10 раз меньше** (нет TypeScript, тестов, devDeps)\n- Меньше attack surface — нет компилятора в проде\n- Чище — клиент не получает твой исходник\n\n" +
                "## Distroless / scratch\n\nДля максимальной экономии:\n\n```Dockerfile\nFROM gcr.io/distroless/nodejs20-debian12\nCOPY --from=build /app/dist /app/dist\nCMD [\"/app/dist/server.js\"]\n```\n\nDistroless = только Node.js рантайм, ноль OS-утилит. Образ ~80 MB.",
            },
            {
              id: "df-best-practices",
              kind: "READING",
              title: "Best practices Dockerfile",
              xp: 14,
              estMin: 10,
              body:
                "# Чек-лист хорошего Dockerfile\n\n" +
                "1. **Конкретный тег базы** (`node:20.10.0-alpine`, не `node:latest`)\n" +
                "2. **WORKDIR** установлен (не работаем в `/`)\n" +
                "3. **package.json копируется отдельно** до COPY . .\n" +
                "4. **`npm ci`**, не `npm install` (детерминированно)\n" +
                "5. **`--omit=dev`** в проде\n" +
                "6. **`.dockerignore`** есть и заполнен\n" +
                "7. **USER non-root** (USER node для node-образов)\n" +
                "8. **Multi-stage** для компилируемых языков\n" +
                "9. **`CMD [\"node\", \"server.js\"]`** в exec-форме (не shell-форме)\n" +
                "10. **HEALTHCHECK** для production-образа\n" +
                "11. **LABEL** с метаданными (org.opencontainers.image.*)\n" +
                "12. **Не клади секреты в образ** (используй `--secret` или env при run)\n\n" +
                "## Один процесс на контейнер\n\nНе надо запускать nginx + node в одном контейнере. Каждый процесс = свой контейнер. Это упрощает логи, мониторинг и обновления.",
            },
            {
              id: "df-optimize-code",
              kind: "CODE",
              title: "Код: оптимизируй Dockerfile",
              xp: 50,
              estMin: 15,
              body:
                "Перепиши плохой Dockerfile с использованием multi-stage и правильного порядка слоёв.\n\n" +
                "Изначально (плохо):\n```Dockerfile\nFROM node:20\nWORKDIR /app\nCOPY . .\nRUN npm install\nRUN npm run build\nCMD node dist/server.js\n```",
              payload: {
                starter:
                  "FROM node:20-alpine AS build\nWORKDIR /app\n# твой код: правильно скопировать package.json, ci, потом весь код, потом build\n\nFROM node:20-alpine AS runtime\nWORKDIR /app\nENV NODE_ENV=production\n# твой код: только prod-зависимости, копировать dist из build\nCMD [\"node\", \"dist/server.js\"]\n",
                mustContain: ["AS build", "AS runtime", "package", "COPY --from=build", "npm ci"],
                hint: "Сначала COPY package*.json и RUN npm ci, потом COPY . . и build.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "volumes-networks",
      emoji: "🔌",
      title: "Тома и сети",
      description: "Как контейнеры общаются и где хранят данные.",
      modules: [
        {
          id: "storage",
          title: "Хранилище",
          lessons: [
            {
              id: "bind-vs-volume",
              kind: "READING",
              title: "Bind mount vs named volume",
              xp: 14,
              estMin: 10,
              body:
                "# Хранилище данных\n\n" +
                "Контейнер по умолчанию **эфемерный** — удалил, и всё внутри пропало. Чтобы сохранить данные — нужно тома.\n\n" +
                "## Bind mount\n\n" +
                "```bash\ndocker run -v /home/me/code:/app node:20\n```\n\n" +
                "Папка хоста монтируется внутрь контейнера. Идеально для **разработки** (код hot-reload), плохо для **прода** (зависит от пути на хосте).\n\n" +
                "## Named volume\n\n" +
                "```bash\ndocker volume create db_data\ndocker run -v db_data:/var/lib/postgresql/data postgres:16\n```\n\n" +
                "Docker сам управляет местом хранения. Кросс-платформенно. **Использовать в проде** для БД, аплоадов, persistent state.\n\n" +
                "## tmpfs\n\n" +
                "```bash\ndocker run --tmpfs /tmp:size=100M node:20\n```\n\n" +
                "В RAM. Для временных данных, секретов, кэша.\n\n" +
                "## Где живут volumes\n\nLinux: `/var/lib/docker/volumes/`. Через `docker volume ls` и `docker volume inspect db_data` — увидишь точку монтирования.",
            },
            {
              id: "networks",
              kind: "READING",
              title: "Сети Docker",
              xp: 14,
              estMin: 10,
              body:
                "# Сети\n\n" +
                "## Драйверы\n\n- **bridge** (дефолт) — изолированная сеть, NAT'ит наружу\n- **host** — без изоляции, использует сетевой стек хоста (быстрее, но небезопасно)\n- **none** — без сети\n- **overlay** — для Docker Swarm/K8s, между нодами\n\n" +
                "## Создать свою\n\n" +
                "```bash\ndocker network create app-net\ndocker run -d --name api --network app-net my-api\ndocker run -d --name db --network app-net postgres:16\n```\n\n" +
                "Внутри `app-net` контейнеры **видят друг друга по имени**. `api` обращается к БД по адресу `postgres://db:5432`, не по IP.\n\n" +
                "## DNS\n\nDocker встраивает DNS-сервер. Имена сервисов резолвятся внутри сети автоматически. **Не используй IP'ы** — они меняются при пересоздании.\n\n" +
                "## Дефолтная bridge — не то\n\nВ дефолтной bridge-сети **нет автоматического DNS** между контейнерами. Всегда создавай свою сеть (или используй Compose, который делает это сам).",
            },
            {
              id: "container-link",
              kind: "READING",
              title: "Связь контейнеров на практике",
              xp: 12,
              estMin: 10,
              body:
                "# Сценарий: web → api → db\n\n" +
                "```bash\ndocker network create my-app\n\ndocker run -d --name db --network my-app \\\n  -e POSTGRES_PASSWORD=secret \\\n  -v db_data:/var/lib/postgresql/data \\\n  postgres:16-alpine\n\ndocker run -d --name api --network my-app \\\n  -e DATABASE_URL=postgres://postgres:secret@db:5432/postgres \\\n  my-api:1.0\n\ndocker run -d --name web --network my-app -p 80:3000 \\\n  -e API_URL=http://api:4000 \\\n  my-web:1.0\n```\n\n" +
                "Снаружи доступен только **web** (через `-p 80:3000`). API и DB — внутри сети, недоступны напрямую. Это правильная безопасность.\n\n" +
                "## Дебаг\n\n" +
                "```bash\ndocker network inspect my-app          # кто в сети\ndocker exec -it api sh -c 'ping db'    # проверить связь\ndocker exec -it api sh -c 'nslookup db'  # DNS работает?\n```",
            },
            {
              id: "volumes-quiz",
              kind: "QUIZ",
              title: "Тест: тома и сети",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Какой тип хранилища предпочесть в проде для БД?",
                    options: ["bind mount", "named volume", "tmpfs", "ничего"],
                    correct: "named volume",
                  },
                  {
                    q: "Контейнеры в одной кастомной сети находят друг друга по...",
                    options: ["IP", "имени контейнера", "MAC", "hash"],
                    correct: "имени контейнера",
                  },
                  {
                    q: "Что нужно, чтобы контейнер был доступен извне на порту 8080?",
                    options: ["EXPOSE 8080 в Dockerfile", "-p 8080:80 при run", "VOLUME 8080", "ENV PORT=8080"],
                    correct: "-p 8080:80 при run",
                  },
                  {
                    q: "Какая сеть НЕ имеет автоматического DNS?",
                    options: ["custom bridge", "default bridge", "overlay", "host"],
                    correct: "default bridge",
                  },
                ],
              },
            },
            {
              id: "node-app-project",
              kind: "PROJECT",
              title: "Проект: Dockerized Node-приложение",
              xp: 80,
              estMin: 40,
              body:
                "# Проект: упакуй своё API в Docker\n\n" +
                "Возьми любой Express/Fastify «hello world» с одним эндпоинтом `/health`.\n\n" +
                "## Требования\n\n- Multi-stage Dockerfile (build + runtime)\n- `.dockerignore` исключает node_modules, .git, .env\n- Образ < 200 MB\n- Запускается как `docker run -p 8080:3000 my-api`\n- HEALTHCHECK\n- USER node (не root)\n- ENTRYPOINT/CMD в exec-форме\n\n" +
                "## Бонус\n\n- Метки `LABEL org.opencontainers.image.*`\n- Distroless для финальной стадии",
            },
          ],
        },
      ],
    },
    {
      id: "compose",
      emoji: "🎼",
      title: "Docker Compose",
      description: "Multi-container приложения одной командой.",
      modules: [
        {
          id: "compose-basics",
          title: "Compose от и до",
          lessons: [
            {
              id: "why-compose",
              kind: "READING",
              title: "Зачем нужен Compose",
              xp: 10,
              estMin: 7,
              body:
                "# Compose\n\nКогда у тебя 2+ контейнера (api+db, web+api+db, api+db+redis+nginx) — ручной `docker run` превращается в простыню. Compose описывает всё в одном YAML и поднимает одной командой.\n\n" +
                "## Файл compose.yaml\n\n" +
                "```yaml\nname: myapp\n\nservices:\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - db_data:/var/lib/postgresql/data\n    healthcheck:\n      test: pg_isready -U postgres\n      interval: 5s\n\n  api:\n    build: ./apps/api\n    environment:\n      DATABASE_URL: postgres://postgres:secret@db:5432/postgres\n    depends_on:\n      db:\n        condition: service_healthy\n    ports:\n      - 4000:4000\n\nvolumes:\n  db_data:\n```\n\n" +
                "## Команды\n\n" +
                "```bash\ndocker compose up -d --build       # поднять и пересобрать\ndocker compose down                # остановить и удалить контейнеры\ndocker compose down -v             # + volumes\ndocker compose logs -f api         # логи\ndocker compose exec api sh         # зайти\ndocker compose ps                  # статус\n```",
            },
            {
              id: "depends-healthcheck",
              kind: "READING",
              title: "depends_on и healthcheck",
              xp: 12,
              estMin: 8,
              body:
                "# Зависимости и здоровье\n\n" +
                "## depends_on\n\nОпределяет порядок старта.\n\n" +
                "```yaml\napi:\n  depends_on:\n    - db\n```\n\n" +
                "**Проблема:** контейнер `db` запустился ≠ Postgres готов принимать соединения. API упадёт с `ECONNREFUSED`.\n\n" +
                "## С healthcheck\n\n" +
                "```yaml\ndb:\n  image: postgres:16-alpine\n  healthcheck:\n    test: pg_isready -U postgres\n    interval: 5s\n    timeout: 3s\n    retries: 10\n\napi:\n  depends_on:\n    db:\n      condition: service_healthy\n```\n\n" +
                "Теперь `api` стартует **только после** `db: healthy`.\n\n" +
                "## Healthcheck в Dockerfile\n\n" +
                "```Dockerfile\nHEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\\n  CMD wget -qO- http://localhost:3000/health || exit 1\n```\n\n" +
                "Видно через `docker ps` → колонка STATUS показывает `(healthy)` / `(unhealthy)`.",
            },
            {
              id: "compose-volumes-networks",
              kind: "READING",
              title: "Volumes и networks в compose",
              xp: 12,
              estMin: 8,
              body:
                "# Тома и сети в Compose\n\n" +
                "## Тома\n\n" +
                "```yaml\nservices:\n  db:\n    volumes:\n      - db_data:/var/lib/postgresql/data        # named\n      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro  # bind\n\nvolumes:\n  db_data:\n```\n\n" +
                "Префикс имени volume = имя проекта. Так `myapp_db_data` не конфликтует с другими проектами.\n\n" +
                "## Сети\n\nCompose автоматически создаёт сеть `<project>_default`. Все сервисы там и находят друг друга по именам сервисов.\n\n" +
                "Можно создать несколько сетей для изоляции:\n\n" +
                "```yaml\nservices:\n  api:\n    networks: [public, private]\n  db:\n    networks: [private]\n  web:\n    networks: [public]\n\nnetworks:\n  public:\n  private:\n```\n\nТеперь `web` не видит `db` напрямую — только через `api`.",
            },
            {
              id: "compose-env",
              kind: "READING",
              title: "env-файлы и profiles",
              xp: 12,
              estMin: 8,
              body:
                "# Окружение\n\n" +
                "## .env в корне проекта\n\n" +
                "```env\nPOSTGRES_PASSWORD=secret\nAPI_PORT=4000\n```\n\n" +
                "Compose автоматически подхватывает.\n\n" +
                "```yaml\nservices:\n  db:\n    environment:\n      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}\n  api:\n    ports:\n      - ${API_PORT:-4000}:4000     # default 4000\n```\n\n" +
                "## env_file\n\n" +
                "```yaml\nservices:\n  api:\n    env_file:\n      - .env.shared\n      - .env.api\n```\n\n" +
                "Все ключи из этих файлов уйдут в окружение контейнера.\n\n" +
                "## Profiles\n\n" +
                "```yaml\nservices:\n  api: { ... }\n  adminer:\n    image: adminer\n    profiles: [dev]      # стартует только с --profile dev\n```\n\n" +
                "```bash\ndocker compose up                    # без adminer\ndocker compose --profile dev up      # с adminer\n```\n\nУдобно для dev-only сервисов: Adminer, MailHog, Redis Commander.",
            },
            {
              id: "compose-fullstack-project",
              kind: "PROJECT",
              title: "Проект: full-stack compose",
              xp: 100,
              estMin: 60,
              body:
                "# Проект: подними полный стек одной командой\n\n" +
                "Стек: **Postgres + Redis + API (Node) + Web (Next.js) + Nginx**.\n\n" +
                "## Требования\n\n- Все сервисы в одном `compose.yaml`\n- Postgres с healthcheck, named volume\n- Redis с healthcheck\n- API ждёт healthy db и redis (`depends_on`)\n- Nginx проксирует `/api/*` на api, остальное на web\n- Все порты, кроме nginx, **не пробрасываются наружу**\n- Adminer в profile `dev`\n- `.env` со всеми секретами, `.env.example` в git\n\n" +
                "## Бонус\n\n- Multi-stage Dockerfile для api и web\n- Логи в JSON формате для всех сервисов",
            },
          ],
        },
      ],
    },
    {
      id: "docker-prod",
      emoji: "🏭",
      title: "Docker в продакшене",
      description: "Healthchecks, лимиты, логи, безопасность, реестры.",
      modules: [
        {
          id: "prod-ready",
          title: "Production-ready",
          lessons: [
            {
              id: "healthchecks-prod",
              kind: "READING",
              title: "Healthchecks правильно",
              xp: 12,
              estMin: 8,
              body:
                "# Healthcheck в проде\n\n" +
                "## Что проверять\n\n- **Liveness** (жив ли процесс) — простой `/health` который отвечает 200\n- **Readiness** (готов ли принимать трафик) — `/ready` который проверяет коннект к БД, redis\n\n" +
                "## Antipattern\n\nНе проверяй в healthcheck тяжёлые внешние сервисы. Если упадёт условный Stripe API — твой контейнер не должен помечаться unhealthy.\n\n" +
                "## Время\n\n```\n--start-period=30s   # игнор первых 30 сек (приложение стартует)\n--interval=10s       # проверка каждые 10 сек\n--timeout=3s         # ждать ответ не более 3 сек\n--retries=3          # 3 фейла подряд = unhealthy\n```\n\n" +
                "## В Compose\n\n```yaml\nhealthcheck:\n  test: [\"CMD\", \"wget\", \"-qO-\", \"http://localhost:3000/health\"]\n  interval: 10s\n  start_period: 30s\n  retries: 3\n```\n\n" +
                "В Kubernetes аналог — `livenessProbe` и `readinessProbe`.",
            },
            {
              id: "resource-limits",
              kind: "READING",
              title: "Лимиты памяти и CPU",
              xp: 12,
              estMin: 8,
              body:
                "# Resource limits\n\n" +
                "Без лимитов один контейнер может съесть всю память хоста и убить остальные.\n\n" +
                "## docker run\n\n```bash\ndocker run --memory=512m --memory-swap=512m --cpus=1.5 my-api\n```\n\n" +
                "## Compose v3 deploy section (Swarm)\n\n```yaml\ndeploy:\n  resources:\n    limits:\n      memory: 512M\n      cpus: '1.5'\n    reservations:\n      memory: 128M\n```\n\n" +
                "## Compose v2 + Docker (без Swarm)\n\n```yaml\nmem_limit: 512m\ncpus: 1.5\n```\n\n" +
                "## Node.js специфика\n\nV8 не знает о cgroups в старых версиях. Установи `--max-old-space-size`:\n\n```bash\nNODE_OPTIONS=\"--max-old-space-size=400\" node server.js  # 400 MB heap\n```\n\nНа N MB лимита контейнера ставь heap ~80% от N.",
            },
            {
              id: "logging",
              kind: "READING",
              title: "Логирование контейнеров",
              xp: 12,
              estMin: 8,
              body:
                "# Логи\n\n" +
                "**Правило:** пиши в **stdout/stderr** из приложения. Никаких `/var/log/app.log` внутри контейнера. Docker сам соберёт.\n\n" +
                "## Драйверы\n\n- `json-file` (дефолт) — `/var/lib/docker/containers/*/...-json.log`\n- `journald` — systemd\n- `syslog`, `fluentd`, `gelf`, `awslogs`, `gcplogs`\n\n" +
                "## Ротация\n\n```yaml\nlogging:\n  driver: json-file\n  options:\n    max-size: 10m\n    max-file: 5\n```\n\n" +
                "Без этого `docker logs api` сожрёт диск.\n\n" +
                "## JSON-логи приложения\n\nПиши **структурированные** логи (Pino, Winston JSON):\n\n```ts\nimport pino from 'pino';\nconst log = pino();\nlog.info({ userId: 42, action: 'login' }, 'user logged in');\n```\n\n" +
                "Тогда централизованный лог-стор (Loki, Datadog, ELK) сможет фильтровать по полям.",
            },
            {
              id: "container-security",
              kind: "READING",
              title: "Безопасность контейнеров",
              xp: 16,
              estMin: 12,
              body:
                "# Container security\n\n" +
                "## 1. Не root\n\n```Dockerfile\nUSER node     # для node-образов\n# или\nRUN addgroup -S app && adduser -S app -G app\nUSER app\n```\n\nЕсли процесс убежит из контейнера — он не будет root на хосте.\n\n" +
                "## 2. Read-only файловая система\n\n```bash\ndocker run --read-only --tmpfs /tmp my-api\n```\n\nВ контейнер невозможно записать (кроме монтированных volumes и tmpfs).\n\n" +
                "## 3. Drop capabilities\n\n```bash\ndocker run --cap-drop ALL --cap-add NET_BIND_SERVICE my-api\n```\n\n" +
                "## 4. Без --network=host\n\nНе используй host-network, кроме крайней необходимости.\n\n" +
                "## 5. Скан образа\n\n```bash\ndocker scout cves my-api:1.0\n# или trivy\ntrivy image my-api:1.0\n```\n\nВ CI/CD блокируй PR, если найдены HIGH/CRITICAL уязвимости.\n\n" +
                "## 6. Никаких секретов в образе\n\nПередавай через `--env-file`, `--secret` (BuildKit), или внешний секрет-менеджер.\n\n" +
                "## 7. Подпись образов\n\n`cosign` подпишет твои образы. Кластер K8s может проверять подпись через admission controller.",
            },
            {
              id: "registries-cicd",
              kind: "READING",
              title: "Реестры и CI/CD",
              xp: 12,
              estMin: 8,
              body:
                "# Push, pull, deploy\n\n" +
                "## Тегирование для деплоя\n\nКаждый коммит → новый тег. Несколько вариантов:\n\n- `myapp:1.0.0` — semver, для релизов\n- `myapp:git-abc1234` — короткий sha\n- `myapp:main-abc1234` — branch + sha\n- `myapp:latest` — указатель на последний main (опционально)\n\nВ деплой берёшь конкретный sha — он гарантирует воспроизводимость.\n\n" +
                "## GitHub Actions пример\n\n```yaml\n- uses: docker/build-push-action@v5\n  with:\n    push: true\n    tags: |\n      ghcr.io/me/api:${{ github.sha }}\n      ghcr.io/me/api:latest\n    cache-from: type=gha\n    cache-to: type=gha,mode=max\n```\n\n" +
                "## BuildKit cache\n\n```\n--cache-from=type=registry,ref=ghcr.io/me/api:cache\n--cache-to=type=registry,ref=ghcr.io/me/api:cache,mode=max\n```\n\nCI пересобирает образ за 30 секунд вместо 5 минут.",
            },
            {
              id: "prod-image-project",
              kind: "PROJECT",
              title: "Проект: production-ready образ",
              xp: 120,
              estMin: 60,
              body:
                "# Проект: продакшен-образ\n\n" +
                "Сделай Dockerfile + compose-файл для своего API, готовый к деплою.\n\n" +
                "## Чек-лист\n\n- [ ] Multi-stage build\n- [ ] Распиновка версии Node (`node:20.10.0-alpine`)\n- [ ] `.dockerignore` (минимум: node_modules, .git, .env, *.md, tests)\n- [ ] `npm ci --omit=dev` в runtime stage\n- [ ] USER non-root\n- [ ] HEALTHCHECK\n- [ ] LABEL org.opencontainers.image.*\n- [ ] Read-only fs + tmpfs\n- [ ] Memory limit + Node `--max-old-space-size`\n- [ ] Лог-ротация в compose\n- [ ] Запуск через `tini` или встроенный init: `docker run --init` (или `init: true` в compose) — корректно проксирует SIGTERM\n- [ ] Скан Trivy без CRITICAL\n- [ ] Образ < 150 MB\n\n" +
                "Это эталон. Сделав один раз — копируешь во все будущие проекты.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "docker-debugging",
      emoji: "🔧",
      title: "Docker: отладка и тонкости",
      description: "BuildKit, кэш-маунты, debug образа, exec, layer-анализ, SBOM.",
      modules: [
        {
          id: "docker-debug",
          title: "Когда что-то не так",
          lessons: [
            {
              id: "docker-exec-debug",
              kind: "READING",
              title: "Залезть в контейнер и понять что не так",
              xp: 12,
              estMin: 8,
              body:
                "# Дебаг живого контейнера\n\n" +
                "## Зайти внутрь\n\n```bash\ndocker exec -it <name> sh                  # для alpine\ndocker exec -it <name> bash                # для debian\n```\n\n" +
                "Теперь проверяй: `ps aux`, `ls /app`, `env`, `cat /etc/hosts`, `nslookup db`.\n\n" +
                "## Контейнер падает на старте\n\n" +
                "```bash\ndocker logs --tail=100 <name>\ndocker logs -f <name>                       # следить\ndocker inspect <name>                       # точная команда, env, mounts\n```\n\n" +
                "Если приложение падает мгновенно — переопредели CMD на shell, чтобы войти и посмотреть:\n\n```bash\ndocker run -it --rm --entrypoint sh my-image\n```\n\n" +
                "## Distroless без shell\n\n`gcr.io/distroless/*` не имеет shell. Дебагать так:\n\n```bash\nkubectl debug -it pod/api --image=busybox --target=api  # K8s\n# или\ndocker run -it --rm --pid=container:<name> busybox    # один namespace процессов\n```",
            },
            {
              id: "buildkit-advanced",
              kind: "READING",
              title: "BuildKit: secrets, cache, mounts",
              xp: 14,
              estMin: 10,
              body:
                "# BuildKit\n\n" +
                "Современный Docker уже использует BuildKit по умолчанию. Это даёт инструкции `RUN --mount=...` и `--secret`.\n\n" +
                "## Кэш-маунт для npm/pnpm\n\n" +
                "```Dockerfile\n# syntax=docker/dockerfile:1.6\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN --mount=type=cache,target=/root/.npm \\\n    npm ci --prefer-offline --no-audit\nCOPY . .\nRUN npm run build\n```\n\n" +
                "Кэш не попадает в образ, но переиспользуется между сборками. Сборка ускоряется в разы.\n\n" +
                "## pnpm-кэш\n\n```Dockerfile\nRUN --mount=type=cache,id=pnpm,target=/pnpm/store \\\n    pnpm install --frozen-lockfile\n```\n\n" +
                "## Секрет при сборке\n\n```bash\nDOCKER_BUILDKIT=1 docker build \\\n  --secret id=npmrc,src=$HOME/.npmrc -t my-image .\n```\n\n```Dockerfile\nRUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\\n    npm install\n```\n\nСекрет **не попадёт в слой** — недоступен через `docker history`.\n\n" +
                "## Bind с хоста (только в dev)\n\n```Dockerfile\nRUN --mount=type=bind,source=./src,target=/src,ro echo build\n```",
            },
            {
              id: "image-size",
              kind: "READING",
              title: "Уменьшить размер образа",
              xp: 14,
              estMin: 10,
              body:
                "# Чек-лист «образ слишком большой»\n\n" +
                "## Шаги\n\n1. **Multi-stage** — скомпилировал, выкинул devDeps\n2. **Alpine или distroless** база (не `node:20`)\n3. `npm ci --omit=dev` в runtime stage\n4. `.dockerignore` — не тащить `node_modules`, `.git`, тесты, доки\n5. Один `RUN` с цепочкой и очисткой:\n   ```Dockerfile\n   RUN apk add --no-cache --virtual .build-deps gcc \\\n     && npm rebuild bcrypt \\\n     && apk del .build-deps\n   ```\n6. `npm prune --production` если ставил всё\n7. Не клади в образ assets, которые отдаст CDN\n\n" +
                "## Анализ\n\n```bash\ndocker images                              # размеры\ndocker history my-image:1.0                # вес каждого слоя\npnpm dlx dive my-image:1.0                 # интерактивный анализатор\n```\n\n`dive` показывает каждый слой и какие файлы он добавил/изменил/удалил. Видно, какой слой раздул образ.\n\n" +
                "## Distroless для Node\n\n```Dockerfile\nFROM node:20-alpine AS build\n# build...\n\nFROM gcr.io/distroless/nodejs20-debian12\nCOPY --from=build /app /app\nWORKDIR /app\nCMD [\"server.js\"]\n```\n\nОбраз ~80-120 MB, нет shell, нет apt — минимум attack surface.",
            },
            {
              id: "registry-workflow",
              kind: "READING",
              title: "Реестры: GHCR, ECR, тегирование",
              xp: 12,
              estMin: 8,
              body:
                "# Работа с реестрами\n\n" +
                "## GitHub Container Registry (бесплатно для опенсорса)\n\n```bash\necho $GHCR_TOKEN | docker login ghcr.io -u me --password-stdin\ndocker tag my-api ghcr.io/me/api:1.0.0\ndocker tag my-api ghcr.io/me/api:latest\ndocker push ghcr.io/me/api:1.0.0\ndocker push ghcr.io/me/api:latest\n```\n\n" +
                "## AWS ECR\n\n```bash\naws ecr get-login-password --region eu-central-1 \\\n  | docker login --username AWS --password-stdin <acc>.dkr.ecr.eu-central-1.amazonaws.com\n```\n\n## Тегирование стратегия\n\n- `1.0.0`, `1.0`, `1`, `latest` — semver-каскад\n- `git-abc1234` — конкретный коммит для прода\n- `pr-42` — для review-окружений\n- `nightly-2025-05-01` — daily builds\n\nДля production-деплоя бери **конкретный sha**, не `latest`.\n\n" +
                "## Lifecycle policies\n\nРеестр заполняется. Настрой авто-удаление:\n- Сохрани последние 50 образов с тегом\n- Удали образы без тега старше 7 дней\n- Удали `pr-*` образы старше 30 дней\n\n" +
                "## SBOM и подпись\n\n```bash\ndocker buildx build --sbom=true --provenance=true ...   # SBOM в образ\ncosign sign ghcr.io/me/api:1.0.0                         # подпись\ncosign verify ghcr.io/me/api:1.0.0                       # проверка\n```\n\nК8s admission controller (Sigstore Policy Controller) может разрешать только подписанные образы.",
            },
            {
              id: "docker-debug-quiz",
              kind: "QUIZ",
              title: "Тест: Docker advanced",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Чем посмотреть, какой слой раздул образ?",
                    options: ["docker logs", "docker history / dive", "docker stats", "docker info"],
                    correct: "docker history / dive",
                  },
                  {
                    q: "Как НЕ оставить секрет в слоях образа?",
                    options: [
                      "ENV SECRET=...",
                      "RUN --mount=type=secret",
                      "COPY .env .",
                      "ARG SECRET=...",
                    ],
                    correct: "RUN --mount=type=secret",
                  },
                  {
                    q: "Что лучше для прода: latest или конкретный sha?",
                    options: ["latest", "конкретный sha", "одинаково", "tag :prod"],
                    correct: "конкретный sha",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
