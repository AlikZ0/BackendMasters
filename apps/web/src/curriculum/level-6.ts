import type { Track } from "./types";

export const LEVEL_6: Track = {
  id: "l6-prod-engineering",
  level: "EXPERT",
  title: "Уровень 6 — Прод-инжиниринг",
  description:
    "Linux, Git, AWS, Kubernetes глубоко, перфоманс, микросервисы и продвинутая безопасность — то, что отличает senior от staff.",
  hours: 28,
  courses: [
    // ─────────────────────────────────────────────────────────────
    {
      id: "linux-for-backend",
      emoji: "🐧",
      title: "Linux для backend-инженера",
      description: "Процессы, сигналы, файловая система, сеть, bash — без этого не дебажить прод.",
      modules: [
        {
          id: "linux-essentials",
          title: "Базовый набор",
          lessons: [
            {
              id: "processes-signals",
              kind: "READING",
              title: "Процессы и сигналы",
              xp: 14,
              estMin: 10,
              body:
                "# Процессы и сигналы\n\n" +
                "Любая программа в Linux — это **процесс** с PID, родителем (PPID), пользователем, окружением и набором файловых дескрипторов.\n\n" +
                "## Команды первой необходимости\n\n" +
                "```bash\nps aux                    # все процессы\nps -ef --forest          # с деревом родства\ntop                       # живой топ\nhtop                      # красивый top (если установлен)\npgrep -fl node            # найти PID по имени\nlsof -i :3000             # кто слушает порт 3000\n```\n\n" +
                "## Сигналы\n\nКак ОС просит/заставляет процесс что-то сделать:\n\n" +
                "- `SIGTERM` (15) — «вежливо завершись» (можно перехватить)\n" +
                "- `SIGINT` (2) — Ctrl+C из терминала\n" +
                "- `SIGKILL` (9) — «умри сейчас», нельзя перехватить\n" +
                "- `SIGHUP` (1) — перечитай конфиг\n" +
                "- `SIGUSR1/2` — для своих нужд (часто: ротация логов)\n\n" +
                "```bash\nkill 12345         # SIGTERM\nkill -9 12345      # SIGKILL\nkill -HUP 12345\n```\n\n" +
                "## Graceful shutdown в Node\n\n```ts\nprocess.on('SIGTERM', async () => {\n  console.log('shutting down');\n  await server.close();\n  await db.disconnect();\n  process.exit(0);\n});\n```\n\n" +
                "Без этого Kubernetes/Docker убьют тебя через 30 секунд `SIGKILL`'ом, и в полёте останутся обрывки запросов.",
            },
            {
              id: "fs-permissions",
              kind: "READING",
              title: "Файловая система и права",
              xp: 12,
              estMin: 8,
              body:
                "# Файловая система\n\n" +
                "## Иерархия (важное)\n\n" +
                "- `/etc` — конфиги системы\n- `/var/log` — логи\n- `/var/lib` — состояние сервисов (БД, Docker)\n- `/tmp` — временное (часто tmpfs, RAM)\n- `/proc` — виртуальная ФС с инфой о процессах (`/proc/12345/status`)\n- `/sys` — то же про железо/cgroups\n- `/dev/null` — выкинуть, `/dev/urandom` — случайные байты\n\n" +
                "## Права (rwx для user/group/other)\n\n" +
                "```bash\nls -l\n# -rw-r--r-- 1 user user 1024 Jan 1 12:00 file\n#  user|group|other\n\nchmod 600 .env            # только владельцу\nchmod 755 deploy.sh       # выполнимый всем, пишут только я\nchmod +x script.sh\nchown -R appuser:appuser /app\n```\n\n" +
                "## Цифры\n\nКаждое: r=4, w=2, x=1.\n- `755` = `rwxr-xr-x` — стандарт для скриптов\n- `644` = `rw-r--r--` — стандарт для конфигов\n- `600` = `rw-------` — секреты, ключи SSH\n\n" +
                "## Ссылки\n\n- **Hard link** — другое имя того же inode\n- **Symlink** (`ln -s target link`) — указатель на путь",
            },
            {
              id: "net-tools",
              kind: "READING",
              title: "Сетевые утилиты",
              xp: 14,
              estMin: 10,
              body:
                "# Сеть из терминала\n\n" +
                "## Кто слушает что\n\n" +
                "```bash\nss -tlnp              # TCP listening + PID\nss -tunap             # всё (UDP+TCP, established)\nlsof -i :5432         # кто на 5432\nnetstat -tlnp         # старший брат ss\n```\n\n" +
                "## DNS\n\n" +
                "```bash\ndig api.example.com           # подробно\ndig +short api.example.com    # только адрес\ndig MX example.com            # MX-записи\nnslookup api.example.com\n```\n\n" +
                "## HTTP-дебаг\n\n" +
                "```bash\ncurl -v https://api.example.com           # с заголовками\ncurl -X POST -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"a\"}' https://api/users\ncurl -w '%{http_code} %{time_total}\\n' -o /dev/null -s URL\nhttpie:  http POST api/users name=a       # читаемее curl\n```\n\n" +
                "## Дамп трафика\n\n" +
                "```bash\ntcpdump -i any port 5432 -n      # пакеты к Postgres\nnc -lk 9000                       # тестовый TCP-сервер на 9000\n```\n\n" +
                "## Доступность\n\n" +
                "```bash\nping -c 4 api.example.com\ntraceroute api.example.com\nmtr api.example.com               # ping + traceroute наживую\n```",
            },
            {
              id: "bash-basics",
              kind: "READING",
              title: "Bash-сценарии для деплоя",
              xp: 12,
              estMin: 10,
              body:
                "# Bash для backend\n\n" +
                "## Скелет надёжного скрипта\n\n" +
                "```bash\n#!/usr/bin/env bash\nset -euo pipefail   # упади на ошибке, на использовании unset, на ошибке в pipe\nIFS=$'\\n\\t'         # безопасный разделитель\n\nlog() { echo \"[$(date +%T)] $*\"; }\nfail() { log \"ERROR: $*\"; exit 1; }\n\n[[ \"${API_URL:-}\" ]] || fail \"API_URL not set\"\n\nlog \"deploying $SHA\"\ncurl -fsS -X POST \"$API_URL/deploy\" -d \"sha=$SHA\" || fail \"deploy failed\"\nlog \"done\"\n```\n\n" +
                "## set -euo pipefail — твой друг\n\n- `-e` — упасть на любой команде с ненулевым exit\n- `-u` — упасть на использовании несуществующей переменной\n- `-o pipefail` — упасть, если упала ЛЮБАЯ команда в `|` цепочке\n\n" +
                "## Подстановки\n\n" +
                "```bash\n${VAR:-default}      # default если пусто\n${VAR:?msg}          # ошибка с msg, если пусто\n${VAR%.txt}          # убрать .txt справа\n${VAR##*/}           # basename\n```\n\n" +
                "## Циклы и условия\n\n" +
                "```bash\nfor f in *.log; do\n  echo \"$f\"\ndone\n\nif curl -fsS \"$URL/health\" >/dev/null; then\n  log \"healthy\"\nelse\n  log \"down\"\nfi\n```\n\n" +
                "## Когда хватит bash\n\nЕсли скрипт > 100 строк, > 3 функций, нужен JSON-парсинг — переходи на Python или Node. Bash для глюя, не для логики.",
            },
            {
              id: "linux-quiz",
              kind: "QUIZ",
              title: "Тест: Linux essentials",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Какой сигнал нельзя перехватить?",
                    options: ["SIGTERM", "SIGINT", "SIGKILL", "SIGHUP"],
                    correct: "SIGKILL",
                  },
                  {
                    q: "Команда увидеть кто слушает порт 3000:",
                    options: ["ss -tlnp", "ps aux", "df -h", "uptime"],
                    correct: "ss -tlnp",
                  },
                  {
                    q: "Что значит chmod 600 в правах?",
                    options: [
                      "rw для всех",
                      "только владелец читает и пишет",
                      "выполнимый",
                      "запрет всего",
                    ],
                    correct: "только владелец читает и пишет",
                  },
                  {
                    q: "Что делает `set -e` в bash?",
                    options: [
                      "включает echo",
                      "выходит на первой ошибке",
                      "включает env",
                      "удаляет файлы",
                    ],
                    correct: "выходит на первой ошибке",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "git-pro",
      emoji: "🌳",
      title: "Git как Pro",
      description: "Rebase, конфликты, hooks, workflow в команде.",
      modules: [
        {
          id: "git-deep",
          title: "Глубже add/commit",
          lessons: [
            {
              id: "git-mental-model",
              kind: "READING",
              title: "Ментальная модель Git",
              xp: 14,
              estMin: 10,
              body:
                "# Git — это граф коммитов\n\n" +
                "Все «магические» команды git — это навигация и переписывание этого графа.\n\n" +
                "## Три области\n\n" +
                "- **Working tree** — твои файлы\n- **Index (staging)** — что попадёт в следующий коммит (`git add`)\n- **Repository** — закоммиченная история (`git commit`)\n\n" +
                "Между ними:\n```\nWorking ──add──→ Index ──commit──→ Repo\n        ←restore──     ←reset──\n```\n\n" +
                "## Ветки — это указатели\n\nВетка `main` — это просто файл с SHA коммита. `HEAD` — указатель «где я сейчас». Все «слияния», «переключения веток» — это движение этих указателей.\n\n" +
                "## Что происходит при commit\n\n1. Git создаёт **снимок** дерева файлов\n2. Хеширует его в **commit-объект** (с автором, временем, сообщением, родителем)\n3. Ставит указатель ветки на новый SHA\n\nПонимание этого делает rebase, cherry-pick, reset не страшными.",
            },
            {
              id: "git-rebase",
              kind: "READING",
              title: "Rebase и interactive rebase",
              xp: 16,
              estMin: 12,
              body:
                "# Rebase\n\n" +
                "## Зачем\n\nКогда твоя feature-ветка ушла от main, у тебя два варианта:\n\n- `git merge main` — создаёт merge-коммит, история «вилкой»\n- `git rebase main` — переписывает твои коммиты поверх main, история **линейная**\n\n```\n# до:\nA - B - C - D (main)\n     \\\n      E - F (feature)\n\n# после rebase main:\nA - B - C - D (main)\n             \\\n              E' - F' (feature)\n```\n\n" +
                "## Команды\n\n" +
                "```bash\ngit fetch origin\ngit rebase origin/main          # перенести свои коммиты поверх свежего main\n# конфликт?\ngit status                       # покажет, где\n# исправь файлы\ngit add <files>\ngit rebase --continue           # дальше\ngit rebase --abort              # отменить\n```\n\n" +
                "## Interactive rebase — переписать историю\n\n" +
                "```bash\ngit rebase -i HEAD~5\n```\n\nОткроется редактор:\n```\npick abc123 add validation\nfixup def456 typo\npick ghi789 add tests\nsquash jkl012 cleanup\nreword mno345 update README\n```\n\n- **pick** — оставить как есть\n- **reword** — изменить сообщение\n- **squash** — объединить с предыдущим\n- **fixup** — то же, без сохранения сообщения\n- **drop** — выкинуть\n- **edit** — остановиться, дать поправить\n\n" +
                "## Золотое правило\n\n**Не rebase публичные ветки**, на которые ссылаются другие. Только свою feature-ветку перед merge-ем.",
            },
            {
              id: "git-conflicts",
              kind: "READING",
              title: "Разрешение конфликтов",
              xp: 12,
              estMin: 10,
              body:
                "# Конфликты\n\nГде Git не может решить сам:\n\n```\n<<<<<<< HEAD\nconst PORT = 3000;\n=======\nconst PORT = 4000;\n>>>>>>> feature/new-port\n```\n\nВыше `=======` — твоя версия. Ниже — приходящая.\n\n## Шаги\n\n1. `git status` — посмотри список конфликтных файлов\n2. Открой файл, **удали маркеры**, оставь правильный код\n3. `git add <file>` — пометить как разрешённое\n4. `git rebase --continue` (или `git merge --continue`)\n\n## Удобные инструменты\n\n```bash\ngit config --global merge.tool vimdiff\ngit mergetool                              # GUI-разрешалка\ngit config --global merge.conflictstyle diff3   # покажет ОБЩЕГО предка\n```\n\n## Стратегии\n\n- `--ours` — оставить наше при rebase\n- `--theirs` — оставить приходящее\n- `git checkout --ours <file>` — взять нашу версию полностью\n\n## Профилактика\n\n- Часто `git pull --rebase` (или `git fetch && git rebase origin/main`)\n- Маленькие PR-ы, ранний review\n- Один файл — один автор по возможности",
            },
            {
              id: "git-workflows",
              kind: "READING",
              title: "Workflow в команде",
              xp: 12,
              estMin: 8,
              body:
                "# Командные workflow\n\n" +
                "## Trunk-based\n\n- Одна основная ветка (`main`)\n- Короткоживущие feature-ветки (1-3 дня)\n- Частые мержи через PR + CI\n- Релизы — теги на main\n\n**Лучший выбор для веба**, особенно с CI/CD.\n\n" +
                "## GitFlow (старый, тяжёлый)\n\n- `main` — релизы\n- `develop` — текущая разработка\n- `feature/*`, `release/*`, `hotfix/*`\n\nХорошо для библиотек с явными версиями. Для SaaS — overkill.\n\n" +
                "## GitHub Flow\n\nПодмножество trunk-based:\n1. Ветка от main\n2. PR\n3. Review + CI зелёный\n4. Squash merge в main\n5. Деплой автоматом\n\n" +
                "## Соглашения коммитов\n\n**Conventional Commits**:\n```\nfeat(auth): add JWT refresh rotation\nfix(payments): handle Stripe timeout\nrefactor(db): move repos behind interface\nchore: bump deps\ndocs: README quickstart\ntest: add e2e for /orders\n```\n\nДают автоматический CHANGELOG и semver через `semantic-release`.",
            },
            {
              id: "git-hooks",
              kind: "READING",
              title: "Hooks: pre-commit, husky",
              xp: 12,
              estMin: 8,
              body:
                "# Git hooks\n\nСкрипты в `.git/hooks/`, которые срабатывают на события (pre-commit, pre-push, commit-msg).\n\n## Husky — современный способ\n\n```bash\npnpm add -D husky lint-staged\nnpx husky init\n```\n\n`.husky/pre-commit`:\n```bash\nnpx lint-staged\n```\n\n`package.json`:\n```json\n\"lint-staged\": {\n  \"*.{ts,tsx}\": [\"eslint --fix\", \"prettier --write\"],\n  \"*.{json,md}\": [\"prettier --write\"]\n}\n```\n\n" +
                "## Что обычно вешают\n\n- `pre-commit` — eslint + prettier на staged файлах\n- `commit-msg` — проверка conventional commits через `commitlint`\n- `pre-push` — `pnpm typecheck && pnpm test`\n\n## Скип в крайнем случае\n\n```bash\ngit commit --no-verify\ngit push --no-verify\n```\n\nНо если ты часто скипаешь — хуки сделаны плохо или процесс плохой. Чини, не скипай.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "aws-for-backend",
      emoji: "☁️",
      title: "AWS-минимум для бекендера",
      description: "EC2, S3, RDS, IAM, Lambda — без претензии на сертификат, но достаточно чтобы понимать.",
      modules: [
        {
          id: "aws-essentials",
          title: "Сервисы, которые встречаются каждый день",
          lessons: [
            {
              id: "regions-az",
              kind: "READING",
              title: "Регионы и Availability Zones",
              xp: 10,
              estMin: 7,
              body:
                "# География AWS\n\n" +
                "- **Region** (`eu-central-1`, `us-east-1`) — географическая зона. Сервисы в разных регионах — разные.\n- **Availability Zone** (`eu-central-1a`, `eu-central-1b`) — изолированный дата-центр в регионе. Внутри региона их обычно 3.\n- **Edge location** — точки CDN (CloudFront), их сотни.\n\n## Зачем знать\n\n- **HA** — деплой минимум в 2 AZ. Одна AZ упала — другая работает.\n- **Latency** — выбирай регион ближе к пользователям. EU юзеры → eu-central-1 (Франкфурт), не us-east-1.\n- **Цена** — отличается по регионам. us-east-1 обычно самый дешёвый.\n- **Compliance** — данные ЕС часто обязаны быть в EU-регионе (GDPR).\n\n## Cross-region\n\nТрафик между регионами стоит денег и медленный. Не делай чёрный костыль «БД в US, app в EU».",
            },
            {
              id: "ec2",
              kind: "READING",
              title: "EC2 — виртуальные машины",
              xp: 12,
              estMin: 8,
              body:
                "# EC2 (Elastic Compute Cloud)\n\nВиртуальная машина по требованию.\n\n## Семейства инстансов\n\n- **t3/t4g** — burstable, для дев/малых сервисов (CPU credits)\n- **m6/m7** — общего назначения (сбалансированные)\n- **c6/c7** — compute-optimized (CPU-тяжёлое)\n- **r6/r7** — memory-optimized (БД, кэши)\n- **i4/i7** — storage-optimized (NVMe SSD)\n- **g/p** — GPU\n\nПример: `t3.medium` — 2 vCPU, 4 GB RAM, ~$30/мес.\n\n## Хранилище\n\n- **EBS** — сетевые SSD/HDD, отвязываются от инстанса. Бэкапятся в snapshot.\n- **Instance store** — локальный NVMe, **исчезает** при остановке. Только для кэша.\n\n## Безопасность\n\n- **Security Group** — файрвол на уровне инстанса (правила inbound/outbound)\n- **VPC** — твоя приватная сеть. Внутри: subnets (public/private), route tables.\n- **NAT Gateway** — позволяет приватным субнетам ходить в интернет наружу\n\n## Когда брать EC2 vs контейнеры\n\nEC2 — если нужен полный контроль над OS, кастомный софт. Иначе — **ECS** (контейнеры на AWS) или **Fargate** (serverless контейнеры) или **EKS** (managed Kubernetes).",
            },
            {
              id: "s3",
              kind: "READING",
              title: "S3 — объектное хранилище",
              xp: 12,
              estMin: 8,
              body:
                "# S3 (Simple Storage Service)\n\nХранилище файлов. **Главный сервис AWS**, его используют все.\n\n## Концепции\n\n- **Bucket** — глобально уникальное имя (`my-app-uploads-2025`)\n- **Key** — путь к файлу внутри bucket'а (`users/42/avatar.png`)\n- **Object** — собственно файл + метаданные\n\n## Для чего бекендеру\n\n- **Загрузки пользователей** (аватары, документы) — через **pre-signed URL**\n- **Бэкапы БД**\n- **Статические ассеты** + CloudFront\n- **Хранение логов** (Glacier для долгого хранения)\n\n## Pre-signed URL\n\nГенерируешь подписанный URL на стороне сервера, отдаёшь клиенту. Клиент **загружает напрямую в S3**, минуя твой API.\n\n```ts\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nimport { PutObjectCommand } from '@aws-sdk/client-s3';\n\nconst url = await getSignedUrl(s3, new PutObjectCommand({\n  Bucket: 'uploads',\n  Key: `users/${userId}/${filename}`,\n  ContentType: 'image/png',\n}), { expiresIn: 300 });\n```\n\n## Storage classes\n\n- **STANDARD** — горячее, дороже\n- **STANDARD_IA** — нечасто читается\n- **GLACIER** — холодное, дешёвое, доступ часами\n\n## Цена\n\nГлавный счёт — **трафик наружу** ($0.09/GB), а не хранение. Поэтому важно использовать CloudFront.",
            },
            {
              id: "rds",
              kind: "READING",
              title: "RDS — managed Postgres/MySQL",
              xp: 12,
              estMin: 8,
              body:
                "# RDS\n\nManaged БД: AWS делает бэкапы, патчи, failover. Ты — только пользуешься.\n\n## Что выбрать\n\n- **RDS Postgres** — самый частый выбор для веб-проектов\n- **RDS MySQL/MariaDB** — если уже на MySQL\n- **Aurora** — AWS-специфичная вариация Postgres/MySQL, в 2-5 раз быстрее, дороже\n\n## Конфигурация\n\n- **Multi-AZ** — стендбай-реплика в другой AZ. Failover за секунды. **Для прода — обязательно.**\n- **Read replicas** — до 5 реплик для read-нагрузки\n- **Automated backups** — снапшоты, point-in-time recovery до 35 дней\n- **Parameter group** — `shared_buffers`, `max_connections` итд\n\n## Connection pooling\n\nRDS Postgres держит соединение через TCP. Открыл сотню коннекшнов с лямбды → RDS лёг.\n\n**Решение:** **RDS Proxy** или **PgBouncer** перед RDS. Лямбды и контейнеры коннектятся к проксе, а та держит пул к БД.\n\n## Цена\n\nМаленький `db.t3.medium` Multi-AZ ~$120/мес. Aurora — от $300. Для дева — `db.t3.micro` ($15).",
            },
            {
              id: "iam",
              kind: "READING",
              title: "IAM — без него нельзя",
              xp: 14,
              estMin: 10,
              body:
                "# IAM (Identity and Access Management)\n\nКто что может в твоём AWS-аккаунте.\n\n## Сущности\n\n- **User** — человек или скрипт с долгоживущими ключами\n- **Group** — набор юзеров\n- **Role** — временные креды для сервиса (EC2, Lambda, ECS)\n- **Policy** — JSON-документ с разрешениями\n\n## Policy пример\n\n```json\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetObject\", \"s3:PutObject\"],\n      \"Resource\": \"arn:aws:s3:::my-uploads/*\"\n    }\n  ]\n}\n```\n\n## Принципы\n\n1. **Least privilege** — давай минимум прав. Не `s3:*`, а конкретные действия.\n2. **Roles, а не keys** — у EC2-инстанса ставь роль, у Lambda тоже. Никаких хардкоженных ключей.\n3. **MFA на root** — обязательно. И не используй root для рутины, заведи себе админ-юзера.\n4. **Никогда** не коммить `AKIA...` ключи в git. AWS их сразу отзовёт через GitGuardian, и счёт может прийти на $5000 от криптомайнеров.\n\n## Локальное использование\n\n```bash\naws configure                      # положит ключи в ~/.aws/credentials\naws s3 ls\naws sts get-caller-identity        # кто я сейчас\n```",
            },
            {
              id: "lambda",
              kind: "READING",
              title: "Lambda — serverless функции",
              xp: 12,
              estMin: 8,
              body:
                "# Lambda\n\nЗапускает твою функцию по событию (HTTP, S3, очередь, cron). Платишь за миллисекунды.\n\n## Когда брать\n\n- Нерегулярная нагрузка (1 запрос в минуту)\n- Триггеры на S3-события, SQS-сообщения\n- Cron-задачи\n- API-обёртки для других сервисов\n\n## Когда НЕ брать\n\n- Всегда-on сервисы (получится дороже EC2)\n- Долгие задачи (лимит 15 мин)\n- WebSocket с состоянием (используй WebSocket API + DynamoDB)\n- Если cold-start критичен (~200ms-2s в Node)\n\n## Cold start\n\nПервый запрос после простоя стартует медленно (контейнер поднимается). Решения:\n- **Provisioned concurrency** — держи N тёплых инстансов (платишь)\n- **SnapStart** для Java — мгновенный старт\n- Не клади тяжёлые библиотеки, не используй webpack-бандлы > 5 MB\n\n## Лимиты\n\n- 15 минут максимум\n- 10 GB RAM\n- 6 MB payload (синхронный invoke)\n- 1000 одновременных по умолчанию (квоту можно увеличить)\n\n## Цена\n\n- $0.20 за 1M запросов + $0.0000166667 за GB-секунду\n- Free tier: 1M запросов и 400k GB-секунд бесплатно в месяц",
            },
            {
              id: "aws-quiz",
              kind: "QUIZ",
              title: "Тест: AWS",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Сколько обычно AZ в одном AWS-регионе?",
                    options: ["1", "2", "3 (типично)", "10"],
                    correct: "3 (типично)",
                  },
                  {
                    q: "Главный счёт за S3 обычно — это...",
                    options: [
                      "хранение",
                      "трафик наружу (egress)",
                      "API-вызовы",
                      "репликация",
                    ],
                    correct: "трафик наружу (egress)",
                  },
                  {
                    q: "Чтобы Lambda не убила Postgres коннекшнами:",
                    options: [
                      "увеличить лимит RDS",
                      "RDS Proxy / PgBouncer",
                      "перейти на MySQL",
                      "ничего не делать",
                    ],
                    correct: "RDS Proxy / PgBouncer",
                  },
                  {
                    q: "Для EC2 креды лучше передавать через...",
                    options: [
                      "хардкод в коде",
                      ".env файл",
                      "IAM Role на инстансе",
                      "S3 bucket с ключами",
                    ],
                    correct: "IAM Role на инстансе",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "k8s-deep",
      emoji: "☸️",
      title: "Kubernetes глубоко",
      description: "ConfigMap, Secret, Volumes, StatefulSet, Ingress, Helm — что нужно для прода.",
      modules: [
        {
          id: "k8s-config",
          title: "Конфигурация и состояние",
          lessons: [
            {
              id: "configmap-secret",
              kind: "READING",
              title: "ConfigMap и Secret",
              xp: 14,
              estMin: 10,
              body:
                "# ConfigMap и Secret\n\nКонфиги отдельно от образа. **Никогда** не клади env в Deployment YAML.\n\n## ConfigMap\n\n```yaml\napiVersion: v1\nkind: ConfigMap\nmetadata: { name: api-config }\ndata:\n  LOG_LEVEL: info\n  FEATURE_FLAG_NEW_AUTH: \"true\"\n  config.yaml: |\n    cache:\n      ttl: 60s\n```\n\n## Secret\n\nТо же, но base64 (это **не шифрование**, просто кодирование):\n\n```yaml\napiVersion: v1\nkind: Secret\nmetadata: { name: db-creds }\ntype: Opaque\nstringData:\n  DATABASE_URL: postgres://user:pass@db:5432/app\n```\n\n## Использование в Deployment\n\n```yaml\nenv:\n  - name: LOG_LEVEL\n    valueFrom:\n      configMapKeyRef: { name: api-config, key: LOG_LEVEL }\n  - name: DATABASE_URL\n    valueFrom:\n      secretKeyRef: { name: db-creds, key: DATABASE_URL }\nenvFrom:\n  - configMapRef: { name: api-config }   # все ключи разом\n```\n\n## Реальные секреты\n\nДля чувствительного — **AWS Secrets Manager**, **Vault**, **External Secrets Operator**. K8s Secret сам по себе не зашифрован в etcd (если не включить encryption-at-rest).",
            },
            {
              id: "volumes-pv",
              kind: "READING",
              title: "Volumes, PVC, StorageClass",
              xp: 14,
              estMin: 10,
              body:
                "# Хранилище в K8s\n\nPod эфемерный. Чтобы данные пережили перезапуск — нужны тома.\n\n## emptyDir\n\nВременный диск на жизни pod'а. Для кэша.\n\n```yaml\nvolumes:\n  - name: cache\n    emptyDir: {}\n```\n\n## PersistentVolumeClaim (PVC)\n\nЗапрос на постоянное хранилище. Кластер найдёт или создаст PV.\n\n```yaml\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata: { name: db-data }\nspec:\n  accessModes: [ReadWriteOnce]\n  resources: { requests: { storage: 10Gi } }\n  storageClassName: gp3\n```\n\n## StorageClass\n\nОпределяет, какой провайдер даст диск (EBS, GCE PD, NFS).\n\n## Access modes\n\n- **ReadWriteOnce** (RWO) — один pod пишет\n- **ReadWriteMany** (RWX) — много pod'ов пишут (нужна NFS/EFS)\n- **ReadOnlyMany** (ROX) — много pod'ов читают\n\n## Главное правило\n\nДля БД не используй обычный Deployment — используй **StatefulSet** (см. ниже).",
            },
            {
              id: "statefulset",
              kind: "READING",
              title: "StatefulSet — для БД и очередей",
              xp: 14,
              estMin: 10,
              body:
                "# StatefulSet\n\nDeployment подходит для **stateless** реплик (api, web). Для БД, Kafka, Elasticsearch — **StatefulSet**.\n\n## Что даёт\n\n- **Стабильные имена** pod'ов: `db-0`, `db-1`, `db-2` (а не случайные)\n- **Стабильные DNS**: `db-0.db.default.svc.cluster.local`\n- **Свой PVC** на каждый pod (не общий)\n- **Упорядоченный** старт/остановка (db-0 первый, db-2 последний)\n\n```yaml\napiVersion: apps/v1\nkind: StatefulSet\nmetadata: { name: db }\nspec:\n  serviceName: db\n  replicas: 3\n  selector: { matchLabels: { app: db } }\n  template:\n    metadata: { labels: { app: db } }\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          volumeMounts:\n            - name: data\n              mountPath: /var/lib/postgresql/data\n  volumeClaimTemplates:\n    - metadata: { name: data }\n      spec:\n        accessModes: [ReadWriteOnce]\n        resources: { requests: { storage: 50Gi } }\n```\n\nКаждый pod получает **свой** диск (db-0 → pvc-db-data-0 итд).\n\n## Когда не StatefulSet\n\nНа проде managed-БД (RDS, Cloud SQL) лучше своего Postgres в K8s. Управление, бэкапы, апгрейды — на провайдере.",
            },
            {
              id: "ingress-deep",
              kind: "READING",
              title: "Ingress + cert-manager",
              xp: 14,
              estMin: 10,
              body:
                "# Ingress\n\nL7 роутинг снаружи в кластер: `https://api.example.com/*` → Service `api`.\n\n## Базовый ingress\n\n```yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: api-ingress\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\n    nginx.ingress.kubernetes.io/proxy-body-size: \"25m\"\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts: [api.example.com]\n      secretName: api-tls\n  rules:\n    - host: api.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service: { name: api, port: { number: 80 } }\n```\n\n## TLS автоматически\n\n**cert-manager** + **Let's Encrypt** = бесплатный авто-обновляемый сертификат.\n\n```yaml\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata: { name: letsencrypt-prod }\nspec:\n  acme:\n    server: https://acme-v02.api.letsencrypt.org/directory\n    email: ops@example.com\n    privateKeySecretRef: { name: letsencrypt-prod }\n    solvers:\n      - http01:\n          ingress: { class: nginx }\n```\n\n## Альтернативы Nginx Ingress\n\n- **Traefik** — проще YAML, встроенные dashboard и метрики\n- **Cloud ALB** (AWS Load Balancer Controller) — нативный AWS LB\n- **Istio Gateway** — если уже есть service mesh",
            },
            {
              id: "helm",
              kind: "READING",
              title: "Helm — пакетный менеджер K8s",
              xp: 12,
              estMin: 8,
              body:
                "# Helm\n\nПусть YAML-ы перестанут быть копипастой между окружениями.\n\n## Структура чарта\n\n```\nmychart/\n  Chart.yaml          # имя, версия\n  values.yaml         # дефолтные значения\n  templates/\n    deployment.yaml   # Go-шаблоны\n    service.yaml\n    ingress.yaml\n```\n\n`values.yaml`:\n```yaml\nimage: ghcr.io/me/api\ntag: 1.0.0\nreplicas: 3\nresources:\n  limits: { memory: 512Mi, cpu: 1 }\n```\n\n`templates/deployment.yaml`:\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata: { name: {{ .Release.Name }}-api }\nspec:\n  replicas: {{ .Values.replicas }}\n  template:\n    spec:\n      containers:\n        - name: api\n          image: \"{{ .Values.image }}:{{ .Values.tag }}\"\n          resources: {{- toYaml .Values.resources | nindent 12 }}\n```\n\n## Установка\n\n```bash\nhelm install my-api ./mychart --values=values.prod.yaml --set tag=1.2.3\nhelm upgrade my-api ./mychart --set tag=1.2.4\nhelm rollback my-api\n```\n\n## Готовые чарты\n\nbitnami, official charts: postgres, redis, prometheus, grafana, ingress-nginx — ставятся в одну команду.\n\n## Альтернативы\n\n- **Kustomize** — встроен в kubectl, без шаблонов, через overlays\n- **Pulumi/CDK8s** — манифесты на TypeScript\n\nДля своих сервисов — обычно Helm. Для базы (БД, ingress) — готовые чарты bitnami.",
            },
            {
              id: "k8s-project",
              kind: "PROJECT",
              title: "Проект: задеплой API в K8s",
              xp: 120,
              estMin: 90,
              body:
                "# Проект: реальный деплой в K8s\n\n" +
                "## Локально\n\nПодними **kind** или **minikube** или **k3d** — это K8s на твоей машине в Docker.\n\n```bash\nk3d cluster create dev\nkubectl get nodes\n```\n\n## Что задеплоить\n\nЛюбое твоё backend-приложение (можно из L4 финального проекта) + Postgres.\n\n## Ресурсы\n\n- **ConfigMap** для не-секретного конфига\n- **Secret** для DATABASE_URL\n- **StatefulSet** для Postgres + PVC\n- **Deployment** + **Service** + **HPA** для API\n- **Ingress** с локальным host (`api.local`)\n- **Liveness и Readiness probes** на /health, /ready\n- **Resource limits** на CPU/RAM\n- **Network Policy** — позволь только api → db\n\n## Бонус\n\n- Helm-чарт со своими values\n- Скан образа через trivy в CI\n- Prometheus + Grafana + ServiceMonitor для метрик API",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "performance",
      emoji: "🚀",
      title: "Performance & profiling",
      description: "Event loop профилирование, flame graphs, memory leaks, V8 inspector.",
      modules: [
        {
          id: "perf-deep",
          title: "Глубокое профилирование",
          lessons: [
            {
              id: "event-loop-lag",
              kind: "READING",
              title: "Event loop lag — главный враг",
              xp: 14,
              estMin: 10,
              body:
                "# Event loop lag\n\nЕсли твой код синхронно занимает CPU > 100мс — все остальные запросы ждут. Это и есть **event loop lag**.\n\n## Как измерять\n\n```ts\nimport { monitorEventLoopDelay } from 'perf_hooks';\nconst h = monitorEventLoopDelay({ resolution: 20 });\nh.enable();\nsetInterval(() => {\n  console.log({\n    p50_ms: h.percentile(50) / 1e6,\n    p95_ms: h.percentile(95) / 1e6,\n    p99_ms: h.percentile(99) / 1e6,\n    max_ms: h.max / 1e6,\n  });\n  h.reset();\n}, 5000);\n```\n\nВ норме p99 < 30мс. Если выше — что-то блокирует event loop.\n\n## Главные виновники\n\n- **JSON.parse/stringify** на гигантских объектах\n- Регулярки с **catastrophic backtracking** (`/^(a+)+$/`.test('aaaa...!'))\n- Криптография в основном потоке (используй `crypto.subtle` асинхронно)\n- **Sync** методы fs (`readFileSync` в обработчике)\n- Циклы on big arrays (`arr.map().filter().reduce()` на 1M элементов)\n\n## Решения\n\n1. **Worker Threads** — отдай тяжёлый CPU в отдельный поток\n2. **Stream** обработка вместо `await readFile`\n3. **Очередь + воркер-процесс** для долгих задач\n4. **Кэшируй** результаты тяжёлых вычислений",
            },
            {
              id: "v8-profiler",
              kind: "READING",
              title: "V8 Inspector и flamegraph",
              xp: 14,
              estMin: 10,
              body:
                "# Профилирование Node.js\n\n## Способ 1: Chrome DevTools\n\n```bash\nnode --inspect-brk server.js\n# Или подключиться к работающему:\nnode --inspect server.js\n```\n\nОткрой `chrome://inspect`, кликни «inspect». Увидишь:\n- **Memory** — heap snapshots, поиск утечек\n- **CPU profiler** — где время потрачено\n- **Console**, **Sources** — дебагер\n\n## Способ 2: clinic.js\n\n```bash\npnpm dlx clinic doctor -- node server.js\npnpm dlx clinic flame -- node server.js\npnpm dlx clinic bubbleprof -- node server.js\n```\n\n- **doctor** — диагностика «что не так» (event loop lag, GC, I/O)\n- **flame** — flame graph горячего кода\n- **bubbleprof** — асинхронная активность\n\n## Способ 3: 0x\n\n```bash\npnpm dlx 0x server.js\n# нагрузи через autocannon\npnpm dlx autocannon -c 100 -d 30 http://localhost:3000\n# Ctrl+C → откроется flame graph\n```\n\n## Что искать в flame graph\n\nШирокая полоса = много CPU. Ищи самые широкие, кликай вниз. Часто оказывается, что 60% времени — JSON.stringify или какой-то внутренний цикл.",
            },
            {
              id: "memory-leaks",
              kind: "READING",
              title: "Утечки памяти",
              xp: 14,
              estMin: 10,
              body:
                "# Memory leaks в Node.js\n\nСимптом: RAM медленно растёт, потом OOM-kill.\n\n## Главные источники\n\n1. **Глобальные/модульные Map/Array**, в которые добавляют и не удаляют\n   ```ts\n   const cache = new Map();           // растёт навсегда\n   // лечение: LRU с лимитом\n   ```\n2. **Замыкания на тяжёлые объекты**\n   ```ts\n   function handler(req) {\n     const huge = loadHuge();\n     setTimeout(() => log(req.id), 60_000); // huge не GC'нется минуту\n   }\n   ```\n3. **Не закрытые слушатели**\n   ```ts\n   emitter.on('event', cb);   // забыл off → утечка\n   ```\n4. **Циклические ссылки** (раньше — проблема, в современном V8 GC справляется)\n\n## Как искать\n\n1. `node --inspect`, открой Memory → **Take heap snapshot**\n2. Сделай нагрузку\n3. Сделай ещё снимок\n4. Сравни — найди объекты, которых стало радикально больше\n\n## Защита в проде\n\n```bash\nNODE_OPTIONS='--max-old-space-size=400 --heapsnapshot-near-heap-limit=3'\n```\n\nПри приближении к лимиту Node сам сделает heap snapshot — отправь его в S3, изучай позже.",
            },
            {
              id: "load-testing",
              kind: "READING",
              title: "Нагрузочное тестирование",
              xp: 12,
              estMin: 8,
              body:
                "# Load testing\n\nНе говори «выдержит ли», измеряй.\n\n## autocannon\n\n```bash\npnpm dlx autocannon -c 100 -d 30 http://localhost:3000/api/users\n# 100 параллельных, 30 секунд\n```\n\nПолучаешь:\n- requests/sec\n- latency: avg, p50, p99, max\n- 2xx vs errors\n\n## k6\n\nДля сложных сценариев — несколько шагов с задержками, рамп нагрузки.\n\n```js\n// script.js\nimport http from 'k6/http';\nimport { sleep } from 'k6';\n\nexport const options = {\n  stages: [\n    { duration: '30s', target: 50 },   // ramp-up\n    { duration: '2m', target: 50 },    // stay\n    { duration: '30s', target: 0 },    // ramp-down\n  ],\n};\n\nexport default function () {\n  http.get('https://api.example.com/users');\n  sleep(1);\n}\n```\n\n```bash\nk6 run script.js\n```\n\n## Главные грабли\n\n- Не нагружай прод с продакшен-БД случайно\n- Тест локального API ≠ тест в проде (CDN, LB меняют картину)\n- Один тест ничего не значит — гоняй несколько раз, сравнивай тренды",
            },
            {
              id: "perf-quiz",
              kind: "QUIZ",
              title: "Тест: performance",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "Главный враг Node.js на проде:",
                    options: ["GC", "event loop lag", "DNS", "JIT"],
                    correct: "event loop lag",
                  },
                  {
                    q: "Куда отдать тяжёлый CPU?",
                    options: [
                      "process.nextTick",
                      "Worker Threads / отдельный воркер",
                      "setTimeout(0)",
                      "Promise",
                    ],
                    correct: "Worker Threads / отдельный воркер",
                  },
                  {
                    q: "Чем профилировать с flame graph?",
                    options: ["console.time", "0x / clinic flame", "autocannon", "lsof"],
                    correct: "0x / clinic flame",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "microservices-comm",
      emoji: "🔗",
      title: "Микросервисы: коммуникация",
      description: "gRPC, message brokers, sagas, idempotency, service mesh.",
      modules: [
        {
          id: "ms-comm",
          title: "Как сервисы говорят друг с другом",
          lessons: [
            {
              id: "rest-vs-grpc-vs-mq",
              kind: "READING",
              title: "REST vs gRPC vs очереди",
              xp: 14,
              estMin: 10,
              body:
                "# Способы общения сервисов\n\n## Синхронные\n\n- **REST/HTTP+JSON** — универсально, читаемо, медленнее\n- **gRPC** — Protocol Buffers + HTTP/2, в 5-10x быстрее REST, типизированные контракты, streaming\n- **GraphQL** — клиент сам выбирает поля, сложнее на бекенде\n\n## Асинхронные\n\n- **Message Queue** (RabbitMQ, SQS) — точка-точка, push\n- **Event log** (Kafka, Redis Streams) — лог, многим consumer'ам, replay\n- **Pub/Sub** (Redis, NATS) — fanout, без гарантий\n\n## Когда что\n\n| Кейс | Выбор |\n|------|-------|\n| Внешнее API для веба/мобайла | REST |\n| Внутренние сервисы, нужна скорость | gRPC |\n| Запустить фоновую задачу | Очередь |\n| Реагировать на события из многих мест | Kafka |\n| Realtime в браузер | WebSocket |\n\n## Главное правило\n\n**Async по умолчанию.** Sync (REST/gRPC) — только когда надо немедленный ответ. Иначе ты строишь распределённый монолит.",
            },
            {
              id: "grpc-basics",
              kind: "READING",
              title: "gRPC основы",
              xp: 14,
              estMin: 10,
              body:
                "# gRPC\n\n## Контракт через .proto\n\n```protobuf\nsyntax = \"proto3\";\npackage users;\n\nservice UserService {\n  rpc GetUser (GetUserRequest) returns (User);\n  rpc StreamEvents (Empty) returns (stream UserEvent);\n}\n\nmessage GetUserRequest { string id = 1; }\nmessage User { string id = 1; string email = 2; }\nmessage Empty {}\nmessage UserEvent { string type = 1; string user_id = 2; }\n```\n\nЧерез `protoc` генерируется TS-код для клиента и сервера. **Контракт — единый источник истины**.\n\n## Сервер на Node\n\n```ts\nimport { Server, ServerCredentials } from '@grpc/grpc-js';\nimport { loadPackageDefinition } from '@grpc/grpc-js';\nimport { loadSync } from '@grpc/proto-loader';\n\nconst pkg = loadPackageDefinition(loadSync('users.proto'));\nconst server = new Server();\nserver.addService((pkg.users as any).UserService.service, {\n  GetUser: (call, cb) => cb(null, await db.user.findUnique({ where: { id: call.request.id } })),\n});\nserver.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => server.start());\n```\n\n## Преимущества\n\n- **Бинарный** (Protobuf) — меньше байт по сети\n- **HTTP/2** — мультиплексирование, header compression\n- **Streaming** в обе стороны\n- **Типизированные** контракты\n\n## Когда не gRPC\n\n- Веб-клиент напрямую (нужен gRPC-Web + прокси)\n- Простые публичные API (REST понятнее)\n- Команда без инфраструктуры (генераторы, плагины IDE)",
            },
            {
              id: "mq-vs-stream",
              kind: "READING",
              title: "RabbitMQ vs Kafka",
              xp: 14,
              estMin: 10,
              body:
                "# RabbitMQ vs Kafka — это разные вещи\n\n## RabbitMQ — очередь\n\n- **Сообщение → удалено после обработки**\n- Routing: exchanges (direct, topic, fanout)\n- Хорошо для: фоновые задачи (отправка email), RPC\n- Гарантия доставки: at-least-once с ack\n- Производительность: десятки тысяч msg/sec\n\n## Kafka — append-only лог\n\n- **Сообщение → лежит N дней**, можно перечитать с offset'а\n- Topics + partitions, consumer groups\n- Хорошо для: event sourcing, аналитика, audit log, межкомандные события\n- Гарантия: at-least-once (по умолчанию), exactly-once с настройкой\n- Производительность: миллионы msg/sec\n\n## Простой выбор\n\n- Нужно «отправь на обработку» → RabbitMQ или BullMQ (Redis)\n- Нужно «событие, на которое подпишутся 5 разных команд / систем» → Kafka\n- Нужно потокы данных в аналитику → Kafka → ClickHouse / Snowflake\n\n## NATS / Redis Streams\n\nЛёгкие альтернативы, для in-house проектов часто хватает.",
            },
            {
              id: "saga-pattern",
              kind: "READING",
              title: "Saga и распределённые транзакции",
              xp: 16,
              estMin: 12,
              body:
                "# Распределённые транзакции\n\nСитуация: заказ требует **списать деньги** (Payments service) И **зарезервировать товар** (Inventory service). БД у них разные. ACID-транзакция между ними **невозможна**.\n\n## Решение: Saga\n\nПоследовательность локальных транзакций. Если шаг N упал — выполняются **компенсирующие** транзакции для N-1, N-2, ... 1.\n\n```\nReserveStock  → ChargeCard  → CreateOrder\n   ↓ fail        ↓ fail         ↓ fail\nReleaseStock  ← RefundCard  ← (rollback)\n```\n\n## Реализации\n\n### Choreography (без оркестратора)\nКаждый сервис слушает события и реагирует. Простая, но логика размазана.\n\n```\nOrder created → Inventory reserves stock → emits StockReserved\n  → Payments charges → emits PaymentSucceeded → Order completes\n```\n\n### Orchestration (с оркестратором)\nОтдельный сервис управляет шагами. Понятнее, виднее.\n\n```ts\nasync function placeOrder(orderId) {\n  try {\n    await inventory.reserve(orderId);\n    await payments.charge(orderId);\n    await orders.confirm(orderId);\n  } catch (e) {\n    await payments.refund(orderId).catch(() => {});\n    await inventory.release(orderId).catch(() => {});\n    throw e;\n  }\n}\n```\n\n## Идемпотентность — обязательна\n\nВсе шаги должны быть безопасны к повторам (retries будут).\n\n## Tools\n\n- **Temporal** — самый мощный workflow engine для саг (durable, replay)\n- **AWS Step Functions** — managed-вариант\n- **Своё** на BullMQ — для простых случаев",
            },
            {
              id: "service-mesh",
              kind: "READING",
              title: "Service Mesh (Istio, Linkerd)",
              xp: 12,
              estMin: 8,
              body:
                "# Service Mesh\n\nВместо того чтобы каждый сервис сам делал retries / mTLS / трейсинг — это делает **sidecar-прокси** (Envoy) рядом с каждым pod'ом.\n\n## Что даёт\n\n- **mTLS между сервисами** — автоматическое шифрование + identity\n- **Retries, timeouts, circuit breakers** — без изменения кода\n- **Traffic shifting** — 5% трафика на canary-версию\n- **Observability** — метрики, трейсы, логи без инструментирования\n- **Authorization policies** — «service A может звать service B по /users, но не /admin»\n\n## Цена\n\n- +1 контейнер на каждый pod (RAM, CPU)\n- +50ms на каждый межсервисный hop\n- Сложность операций\n\n## Когда брать\n\n- 20+ микросервисов\n- Нужна compliance (mTLS, audit)\n- Команда DevOps достаточная для эксплуатации\n\n## Когда НЕ брать\n\n- < 5 сервисов\n- Маленькая команда\n- Большинство задач решает Ingress + хороший HTTP-клиент с retries",
            },
            {
              id: "ms-quiz",
              kind: "QUIZ",
              title: "Тест: микросервисы",
              xp: 25,
              estMin: 5,
              body: "",
              payload: {
                questions: [
                  {
                    q: "gRPC использует поверх какого транспорта?",
                    options: ["HTTP/1.1", "HTTP/2", "TCP raw", "WebSocket"],
                    correct: "HTTP/2",
                  },
                  {
                    q: "Чем Kafka отличается от RabbitMQ?",
                    options: [
                      "Kafka — append-only лог с замораживанием сообщений",
                      "RabbitMQ быстрее",
                      "Kafka не имеет consumer groups",
                      "Никак",
                    ],
                    correct: "Kafka — append-only лог с замораживанием сообщений",
                  },
                  {
                    q: "Что такое компенсирующая транзакция в саге?",
                    options: [
                      "повтор шага",
                      "отмена эффектов предыдущего шага",
                      "создание snapshot",
                      "ничего",
                    ],
                    correct: "отмена эффектов предыдущего шага",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: "security-deep",
      emoji: "🔐",
      title: "Безопасность глубже",
      description: "JWT-атаки, supply chain, secret rotation, mTLS, OIDC SSO.",
      modules: [
        {
          id: "sec-deep",
          title: "Серьёзная защита",
          lessons: [
            {
              id: "jwt-attacks",
              kind: "READING",
              title: "JWT-атаки и защита",
              xp: 14,
              estMin: 10,
              body:
                "# JWT-атаки\n\n## 1. alg: none\n\nСтарые библиотеки принимали `{\"alg\":\"none\"}` без подписи. **Всегда** в коде явно указывай ожидаемый alg:\n\n```ts\njwt.verify(token, secret, { algorithms: ['HS256'] }); // не доверяй заголовку\n```\n\n## 2. Подмена alg HS256→RS256\n\nЕсли публичный RSA-ключ известен (он публичный!), злоумышленник подписывает токен через HMAC с этим ключом и `alg=HS256`. Сервер видит «HS256» и проверяет HMAC по тому же ключу — успех.\n\n**Защита:** жёстко указывай алгоритм в `verify`.\n\n## 3. Не проверка exp\n\nВсегда проверяй `exp`. И **iat** на разумность (не из будущего).\n\n## 4. Отсутствие отзыва\n\nJWT нельзя отозвать. Решения:\n- Короткий access (15 мин) + refresh в БД\n- Blacklist в Redis (jti)\n- Token versioning: в claims кладём `tokenVersion`, при logout инкрементим в БД, проверяем\n\n## 5. Слабый секрет\n\nДля HS256 нужен **минимум 32 байта случайных** (не «changeme», не пароль).\n\n```bash\nopenssl rand -base64 48\n```\n\n## 6. Sensitive data в payload\n\nJWT не зашифрован. Не клади туда ничего, что не должен видеть владелец токена.",
            },
            {
              id: "supply-chain",
              kind: "READING",
              title: "Supply chain атаки",
              xp: 14,
              estMin: 10,
              body:
                "# Supply chain\n\n## Что это\n\nАтакующий заражает не твой код, а **зависимость**. Примеры из истории: event-stream (через бекдор-обновление), ua-parser-js, colors.js, xz-utils.\n\n## Защита\n\n1. **Lockfile** обязателен (`pnpm-lock.yaml`, `package-lock.json`). Без него — каждый install качает новые версии.\n\n2. **Pin minor для критичных** — в `dependencies` использовать `\"foo\": \"5.2.1\"` без `^`.\n\n3. **`npm audit` / `pnpm audit`** в CI:\n   ```bash\n   pnpm audit --prod --audit-level=high\n   ```\n\n4. **Snyk / Dependabot / Renovate** — автоматические PR на обновления безопасности.\n\n5. **`--ignore-scripts`** — убирает выполнение postinstall-скриптов чужих пакетов:\n   ```bash\n   pnpm install --ignore-scripts\n   ```\n   Большая часть малвари в npm — это postinstall.\n\n6. **Подписанные коммиты** в своём репо: GPG/SSH-подписи, защита от force push в main.\n\n7. **Trivy / grype** — сканеры контейнеров в CI:\n   ```bash\n   trivy image my-api:1.0\n   ```\n\n8. **Не используй экзотические пакеты** с 50 загрузками в неделю. Чем популярнее, тем больше глаз — меньше шанс зловреда.",
            },
            {
              id: "secret-rotation",
              kind: "READING",
              title: "Ротация секретов",
              xp: 12,
              estMin: 8,
              body:
                "# Ротация секретов\n\nЛюбой секрет когда-нибудь утечёт. Дизайн под это:\n\n## Принципы\n\n1. **Любой секрет должен заменяться без даунтайма**\n2. **Если секрет утёк — заменён за час**\n3. **Никаких \"secrets in code\"** — только из менеджера секретов\n\n## Архитектура\n\nИспользуй **Secrets Manager** (AWS / Vault / Doppler). Приложение запрашивает секрет при старте + рефрешит периодически.\n\n## JWT secret rotation\n\nДва ключа одновременно:\n- `JWT_SECRET_CURRENT` — для подписи новых токенов\n- `JWT_SECRET_PREVIOUS` — для верификации старых, выпущенных до ротации\n\n```ts\nfunction verifyToken(token) {\n  try { return jwt.verify(token, env.JWT_SECRET_CURRENT, opts); }\n  catch { return jwt.verify(token, env.JWT_SECRET_PREVIOUS, opts); }\n}\n```\n\nЧерез TTL access-токена (15 мин) старый ключ можно убрать.\n\n## Database password rotation\n\n1. Создать нового пользователя с паролем 2\n2. Раскатать новые поды с новым паролем\n3. Старого юзера удалить\n\nИли использовать IAM-токены (AWS RDS) — они короткоживущие, ротация автоматическая.\n\n## DB-схема для refresh-токенов\n\nХрани `revoked_at`. При утечке — `UPDATE refresh_tokens SET revoked_at = now()` для всех пользователей. Через 15 мин все access-токены протухнут.",
            },
            {
              id: "oidc-sso",
              kind: "READING",
              title: "OIDC и SSO для бекенда",
              xp: 14,
              estMin: 10,
              body:
                "# OIDC (OpenID Connect)\n\nOAuth 2.0 — про **авторизацию** (что можно). OIDC — про **аутентификацию** (кто ты), как слой поверх OAuth.\n\n## Поток (Authorization Code + PKCE)\n\n1. Клиент → `GET /authorize?response_type=code&client_id=...&scope=openid email&redirect_uri=...&code_challenge=...`\n2. Юзер логинится у IdP (Auth0, Okta, Keycloak, Google)\n3. Редирект → `redirect_uri?code=ABC`\n4. Сервер → POST на `/token` с code + verifier → получает `id_token` (JWT) + `access_token`\n5. Сервер проверяет id_token (подпись, exp, aud, iss), создаёт локальный аккаунт по email/sub\n6. Выдаёт **свою** сессию или JWT\n\n## Зачем\n\n- Всё через одного провайдера (Google Workspace, Azure AD)\n- Поддержка MFA, conditional access, audit — на стороне IdP\n- Нет паролей в твоей БД — нечему утечь\n\n## Готовые решения\n\nНе пиши с нуля:\n- **Auth.js** (Next.js)\n- **Passport.js** + `openid-client`\n- **lucia-auth**\n- **Clerk / Stytch** — managed как сервис\n\n## mTLS для service-to-service\n\nКаждый сервис имеет свой клиентский сертификат. TLS-handshake проверяет обе стороны. Сертификаты выдаются короткоживущие (часы), ротация автоматом через cert-manager или service mesh.",
            },
            {
              id: "rate-limit-defense",
              kind: "READING",
              title: "Защита от brute-force и DDoS",
              xp: 12,
              estMin: 8,
              body:
                "# Защита от брутфорса\n\n## Уровни защиты\n\n1. **CDN/Edge** (Cloudflare) — отбивает крупные DDoS до твоего сервера\n2. **L7 LB** (Nginx, Traefik) — request rate limiting по IP\n3. **Application** — точечный rate limit на критичные эндпоинты\n4. **Backend logic** — exponential backoff после неудачных логинов\n\n## Логин: best practices\n\n- 5 неудачных попыток за 15 минут → блок IP+email на 15 мин\n- Капча после 3 фейлов (hCaptcha, Turnstile)\n- Уведомление на email при логине с нового устройства\n- 2FA (TOTP, WebAuthn)\n\n```ts\nasync function login(email, password, ip) {\n  const key = `login_fails:${ip}:${email}`;\n  const fails = Number(await redis.get(key) ?? 0);\n  if (fails >= 5) throw HttpError(429, 'too_many_attempts');\n\n  const ok = await checkPassword(email, password);\n  if (!ok) {\n    await redis.set(key, fails + 1, 'EX', 900);\n    throw HttpError(401, 'invalid_credentials');\n  }\n  await redis.del(key);\n  return issueTokens();\n}\n```\n\n## Account takeover signals\n\nЛоги логинов с гео и user-agent. Резкая смена страны → требовать 2FA.",
            },
            {
              id: "owasp-final",
              kind: "INTERVIEW",
              title: "Собес: атакуй мою систему",
              xp: 150,
              estMin: 60,
              body:
                "# Security-собес\n\n«У нас REST API на Node.js + Postgres + Redis. Эндпоинты: /auth/login, /users/:id, /payments/charge, /upload (S3 pre-signed URL). Атакуй меня. Что бы ты сделал?»\n\n## Ход мыслей\n\nПройдись по OWASP Top 10:\n\n1. **A01 Broken Access Control**\n   - `GET /users/:id` — проверяешь ли, что юзер запрашивает СЕБЯ или admin?\n   - В JWT кладёшь role — проверяешь ли в каждом endpoint'е?\n\n2. **A03 Injection**\n   - Используешь Prisma? Хорошо. Если raw SQL — параметризованный?\n   - Загрузка файлов: фильтруешь имя? `../../../etc/passwd`?\n\n3. **A04 Insecure Design**\n   - `/payments/charge` — есть Idempotency-Key? Что если клиент дважды нажмёт?\n   - Можно ли оплатить за чужой `userId`?\n\n4. **A07 Auth Failures**\n   - Brute-force защита на `/login`?\n   - Сильные требования к паролю?\n   - Refresh-токены ротируются?\n\n5. **A05 Misconfiguration**\n   - Stack trace в проде?\n   - CORS `*`?\n   - Adminer выставлен наружу?\n\n6. **A09 Logging**\n   - Логируешь успешные/неудачные логины?\n   - Алерты на массовый неудачный логин?\n\n7. **Pre-signed URL для S3**\n   - Срок действия (5 мин max)?\n   - Content-Type фиксирован?\n   - Размер фиксирован (Content-Length-Range)?\n\n8. **Rate limit на pre-signed URL генерацию** — иначе сгенерю миллион\n\n## Что показать на собесе\n\nНе только знание уязвимостей, но и **процесс**: threat modeling, защита по слоям, мониторинг, инцидент-плейбук.",
            },
          ],
        },
      ],
    },
  ],
};
