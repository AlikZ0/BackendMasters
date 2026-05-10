"use client";

import { useState, useRef } from "react";
import { Play, Square, Trash2 } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";

const STARTER = `// Песочница изолирована: нет fetch, нет DOM, нет сетевых API.
// Это настоящий Web Worker — твой код реально исполняется.

function fizzbuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
  }
}

fizzbuzz(15);
console.log("\\n--- Async ---");

(async () => {
  await new Promise(r => setTimeout(r, 200));
  console.log("Привет из Promise через 200мс");
})();
`;

const TIME_LIMIT_MS = 5000;

export default function PlaygroundPage() {
  const [code, setCode] = useState(STARTER);
  const [output, setOutput] = useState<Array<{ type: "log" | "err"; text: string }>>([]);
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = (msg = "Остановлено") => {
    workerRef.current?.terminate();
    workerRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRunning(false);
    setOutput((o) => [...o, { type: "err", text: `\n[${msg}]` }]);
  };

  const run = () => {
    setOutput([]);
    setRunning(true);

    const workerSrc = `
      const send = (type, args) => {
        const text = args.map(a => {
          if (typeof a === 'string') return a;
          try { return JSON.stringify(a, null, 2); } catch { return String(a); }
        }).join(' ');
        self.postMessage({ type, text });
      };
      self.console = {
        log: (...a) => send('log', a),
        info: (...a) => send('log', a),
        warn: (...a) => send('err', a),
        error: (...a) => send('err', a),
        debug: (...a) => send('log', a),
      };
      self.onmessage = async (e) => {
        try {
          const result = await (new Function(e.data))();
          self.postMessage({ type: 'done' });
        } catch (err) {
          self.postMessage({ type: 'err', text: (err && err.stack) ? err.stack : String(err) });
          self.postMessage({ type: 'done' });
        }
      };
    `;
    const blob = new Blob([workerSrc], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<{ type: "log" | "err" | "done"; text?: string }>) => {
      const msg = e.data;
      if (msg.type === "done") {
        worker.terminate();
        workerRef.current = null;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setRunning(false);
        URL.revokeObjectURL(url);
        return;
      }
      const lineType: "log" | "err" = msg.type;
      setOutput((o) => [...o, { type: lineType, text: msg.text ?? "" }]);
    };

    worker.onerror = (e) => {
      setOutput((o) => [...o, { type: "err", text: e.message }]);
      setRunning(false);
      worker.terminate();
      workerRef.current = null;
      URL.revokeObjectURL(url);
    };

    worker.postMessage(code);

    timeoutRef.current = setTimeout(() => {
      stop(`Тайм-аут ${TIME_LIMIT_MS}ms`);
      URL.revokeObjectURL(url);
    }, TIME_LIMIT_MS);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Песочница</h1>
          <p className="text-white/60 text-sm">
            Реальное исполнение JS в Web Worker. Тайм-аут {TIME_LIMIT_MS / 1000}с.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {running ? (
            <button className="btn-ghost text-red-300 border-red-500/30" onClick={() => stop("Остановлено")}>
              <Square className="w-4 h-4" /> Стоп
            </button>
          ) : (
            <button className="btn-primary" onClick={run}>
              <Play className="w-4 h-4" /> Запустить
            </button>
          )}
          <button
            className="btn-ghost text-sm"
            onClick={() => setOutput([])}
            disabled={running}
          >
            <Trash2 className="w-4 h-4" /> Очистить
          </button>
        </div>
      </div>

      <CodeEditor value={code} onChange={setCode} height={420} />

      <div className="glass p-4">
        <div className="text-xs uppercase tracking-wider text-white/45 mb-2">Вывод</div>
        <pre className="font-mono text-sm whitespace-pre-wrap break-words leading-relaxed min-h-[80px]">
          {output.length === 0 ? (
            <span className="text-white/40">Запусти код, чтобы увидеть вывод.</span>
          ) : (
            output.map((line, i) => (
              <div
                key={i}
                className={line.type === "err" ? "text-red-300" : "text-white/85"}
              >
                {line.text}
              </div>
            ))
          )}
        </pre>
      </div>
    </div>
  );
}
