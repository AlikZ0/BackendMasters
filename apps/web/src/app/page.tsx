"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Server,
  Database,
  Container,
  Network,
  Cpu,
  ShieldCheck,
  Sparkles,
  WifiOff,
  Smartphone,
} from "lucide-react";
import { TRACKS, TOTAL_LESSONS, TOTAL_XP, LEVEL_LABEL } from "@/curriculum";

const features = [
  { icon: Server, title: "Node.js + Fastify", text: "От event loop до боевых API." },
  { icon: Database, title: "Базы данных", text: "PostgreSQL, индексы, транзакции, Prisma." },
  { icon: Container, title: "Docker глубоко", text: "30 уроков от первого run до multi-stage в проде." },
  { icon: Network, title: "System Design", text: "CAP, шардинг, репликация, кэши." },
  { icon: Cpu, title: "Перфоманс и scaling", text: "Horizontal scaling, очереди, observability." },
  { icon: ShieldCheck, title: "Безопасность", text: "OWASP, JWT, rate-limit, секреты." },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-12">
      {/* HERO */}
      <section className="relative pt-8">
        <div className="absolute inset-0 -z-10 bg-grid-fade opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <span className="chip mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-cyber-amber" />
            От нуля до Senior Backend Engineer
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-balance">
            Полный курс{" "}
            <span className="bg-gradient-to-r from-accent-400 via-cyber-cyan to-cyber-green bg-clip-text text-transparent">
              backend-инженерии
            </span>
            <br className="hidden sm:block" />
            <span className="text-white/80">в твоём кармане</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 text-lg text-balance">
            {TOTAL_LESSONS} уроков, {TRACKS.length} уровней, реальный фокус на Docker, базы и системный дизайн.
            Прогресс хранится у тебя — ни регистрации, ни сервера, ни оплаты.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/roadmap" className="btn-primary px-6 py-3 text-base">
              Открыть карту <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-ghost px-6 py-3 text-base">
              Мой прогресс
            </Link>
          </div>

          {/* Бейджи преимуществ */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="chip">
              <WifiOff className="w-3.5 h-3.5 text-cyber-cyan" /> Работает офлайн
            </span>
            <span className="chip">
              <Smartphone className="w-3.5 h-3.5 text-cyber-green" /> Учись с телефона
            </span>
            <span className="chip">
              <Trophy /> 0 ₽
            </span>
          </div>
        </motion.div>

        {/* Уровни-ленточка */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TRACKS.map((t, i) => {
            const lessonCount = t.courses.reduce(
              (acc, c) => acc + c.modules.reduce((m, mm) => m + mm.lessons.length, 0),
              0,
            );
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass p-4"
              >
                <div className="text-xs font-mono text-accent-400">L{i + 1}</div>
                <div className="text-sm font-semibold mt-1">{LEVEL_LABEL[t.level]}</div>
                <div className="text-[11px] text-white/50 mt-1">{lessonCount} уроков</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold">Что внутри</h2>
          <p className="text-white/60">
            {TOTAL_LESSONS} уроков с настоящим текстом, тестами, кодовыми задачами и проектами.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
              className="glass p-5 hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center text-accent-400">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="text-sm text-white/65 mt-1">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="glass-strong p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyber-green/20 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Готов? Это путь, а не статья.
            </h2>
            <p className="text-white/70 mb-4">
              {TOTAL_XP.toLocaleString("ru-RU")} XP к получению, ~{TRACKS.reduce((s, t) => s + t.hours, 0)} часов
              чистого обучения. После — ты отвечаешь на любые вопросы про event loop, индексы Postgres,
              multi-stage Dockerfile и repli­cation lag без подсказок.
            </p>
            <Link href="/roadmap" className="btn-primary">
              Поехали <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <pre className="font-mono text-xs sm:text-sm bg-black/40 border border-white/10 rounded-2xl p-4 overflow-x-auto">
{`# Ничего не нужно ставить.
# Открой в браузере (можно с телефона)
# и начни с первого урока.

→ Карта обучения
→ Уровень 1: Основы JS/Node.js
→ Уровень 4: Docker от и до
→ Уровень 5: Senior Backend
→ Финальный проект`}
          </pre>
        </div>
      </section>
    </div>
  );
}

function Trophy(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path d="M6 5h12v6a6 6 0 0 1-12 0V5Z" />
      <path d="M9 21h6" />
      <path d="M12 17v4" />
    </svg>
  );
}
