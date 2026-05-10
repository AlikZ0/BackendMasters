"use client";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Прочитать значение куки на клиенте */
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const target = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const c = part.trim();
    if (c.startsWith(target)) {
      try {
        return decodeURIComponent(c.slice(target.length));
      } catch {
        return c.slice(target.length);
      }
    }
  }
  return null;
}

/** Записать куку. По умолчанию — год, путь /, SameSite=Lax. */
export function writeCookie(
  name: string,
  value: string,
  opts: { maxAge?: number; path?: string; sameSite?: "Lax" | "Strict" | "None" } = {},
): void {
  if (typeof document === "undefined") return;
  const maxAge = opts.maxAge ?? ONE_YEAR;
  const path = opts.path ?? "/";
  const sameSite = opts.sameSite ?? "Lax";
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${name}=${encodeURIComponent(value)}` +
    `; Max-Age=${maxAge}; Path=${path}; SameSite=${sameSite}${secure}`;
}

/** Удалить куку */
export function deleteCookie(name: string): void {
  writeCookie(name, "", { maxAge: 0 });
}
