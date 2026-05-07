"use client";

import { useEffect } from "react";

const STORAGE_KEY = "noir.theme.dev.vars.v1";

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#([0-9a-fA-F]{6})$/.test(value.trim());
}

function looksLikeThemeVars(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  if (keys.length < 3) return false;
  return (
    ("--color-background" in value || "--color-page" in value) &&
    keys.some((k) => k.startsWith("--color-"))
  );
}

function getThemeFromLocalStorage(): Record<string, unknown> | null {
  const direct = localStorage.getItem(STORAGE_KEY);
  if (direct) {
    const parsed = safeParseJson(direct);
    if (looksLikeThemeVars(parsed)) return parsed;
  }

  // Fallback: scan all keys for a stored theme object (covers prod mismatches).
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const parsed = safeParseJson(raw);
    if (looksLikeThemeVars(parsed)) return parsed;
  }

  return null;
}

export function ThemeLocalStorageHydrator() {
  useEffect(() => {
    const parsed = getThemeFromLocalStorage();
    if (!parsed) return;

    // Apply any stored hex colors as CSS variables.
    for (const [key, value] of Object.entries(parsed)) {
      if (!key.startsWith("--")) continue;
      if (!isHexColor(value)) continue;
      document.documentElement.style.setProperty(key, value);
    }

    // Back-compat: older setups stored page bg in --color-background.
    const legacyBg = parsed["--color-background"];
    const page = parsed["--color-page"];
    if (isHexColor(legacyBg) && !isHexColor(page)) {
      document.documentElement.style.setProperty("--color-page", legacyBg);
    }
  }, []);

  return null;
}

