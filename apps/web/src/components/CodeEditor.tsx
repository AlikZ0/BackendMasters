"use client";

import dynamic from "next/dynamic";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  value: string;
  onChange: (v: string) => void;
  language?: "javascript" | "typescript" | "json";
  height?: number | string;
}

export function CodeEditor({ value, onChange, language = "javascript", height = 320 }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0b0e1a]">
      <Monaco
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          fontSize: 13,
          fontFamily: "var(--font-mono)",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
        }}
      />
    </div>
  );
}
