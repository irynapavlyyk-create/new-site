export function safeLoad<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`[storage] failed to parse ${key}:`, e);
    try {
      localStorage.removeItem(key);
    } catch {}
    return null;
  }
}

export function safeSave(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[storage] failed to save ${key}:`, e);
    return false;
  }
}

export function safeRead(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
