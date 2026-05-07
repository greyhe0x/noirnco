"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

type ThemeVarKey =
  | "--color-page"
  | "--color-background"
  | "--color-surface"
  | "--color-primary"
  | "--color-primary-dark"
  | "--color-primary-light"
  | "--color-golden"
  | "--color-secondary"
  | "--color-secondary-dark";

type ThemeVar = { key: ThemeVarKey; label: string };

const THEME_VARS: ThemeVar[] = [
  { key: "--color-page", label: "Page bg (Blue)" },
  { key: "--color-background", label: "Background" },
  { key: "--color-surface", label: "Surface" },
  { key: "--color-primary", label: "Primary (Gold)" },
  { key: "--color-primary-dark", label: "Primary dark" },
  { key: "--color-primary-light", label: "Primary light (Blue)" },
  { key: "--color-golden", label: "Golden" },
  { key: "--color-secondary", label: "Secondary (Text)" },
  { key: "--color-secondary-dark", label: "Secondary dark" },
];

const STORAGE_KEY = "noir.theme.dev.vars.v1";

function getCssVar(key: ThemeVarKey): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(key);
  return value.trim();
}

function setCssVar(key: ThemeVarKey, value: string) {
  document.documentElement.style.setProperty(key, value);
}

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

export function ThemeDevPanel() {
  const [open, setOpen] = useState(false);
  const [vars, setVars] = useState<Record<ThemeVarKey, string> | null>(null);

  const defaults = useMemo(() => {
    const d = {} as Record<ThemeVarKey, string>;
    for (const v of THEME_VARS) d[v.key] = "";
    return d;
  }, []);

  const loadFromCss = useCallback(() => {
    const d = { ...defaults };
    for (const v of THEME_VARS) d[v.key] = getCssVar(v.key) || d[v.key];
    setVars(d);
  }, [defaults]);

  const persist = useCallback((next: Record<ThemeVarKey, string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const applyAll = useCallback((next: Record<ThemeVarKey, string>) => {
    for (const v of THEME_VARS) {
      const value = next[v.key]?.trim();
      if (value) setCssVar(v.key, value);
    }
  }, []);

  useEffect(() => {
    loadFromCss();

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = safeParseJson(raw);
    if (!isRecord(parsed)) return;

    const next = { ...defaults };
    for (const v of THEME_VARS) {
      const stored = parsed[v.key];
      if (isHexColor(stored)) next[v.key] = stored;
      else next[v.key] = getCssVar(v.key) || next[v.key];
    }

    // Back-compat: older dev panel stored page bg in --color-background
    const legacyBg = parsed["--color-background"];
    if (isHexColor(legacyBg) && !isHexColor(parsed["--color-page"])) {
      next["--color-page"] = legacyBg;
    }

    setVars(next);
    applyAll(next);
  }, [applyAll, defaults, loadFromCss]);

  if (!vars) return null;

  return (
    <div className="fixed bottom-4 right-4 z-9999">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "rounded-full px-4 py-2 border font-body font-semibold text-sm",
          "bg-white/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)]",
          "border-gray-200 hover:border-primary/60 hover:text-secondary transition-colors"
        )}
      >
        Theme (dev)
      </button>

      {open && (
        <div className="mt-3 w-[320px]">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading font-semibold text-secondary" style={{ fontSize: "0.9rem" }}>
                Live theme controls
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-body text-gray-400 hover:text-secondary transition-colors"
                style={{ fontSize: "0.8rem" }}
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {THEME_VARS.map((v) => (
                <label key={v.key} className="flex items-center justify-between gap-3">
                  <span className="font-body text-gray-600" style={{ fontSize: "0.8rem" }}>
                    {v.label}
                  </span>
                  <input
                    type="color"
                    value={vars[v.key] || "#000000"}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      const next = { ...vars, [v.key]: nextValue };
                      setVars(next);
                      setCssVar(v.key, nextValue);
                      persist(next);
                    }}
                    className="h-8 w-12 rounded-md border border-gray-200 bg-white"
                    aria-label={v.label}
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  document.documentElement.removeAttribute("style");
                  loadFromCss();
                }}
                className="font-body text-gray-500 hover:text-secondary transition-colors"
                style={{ fontSize: "0.8rem" }}
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => {
                  // Handy preset: blue background + gold accent
                  const preset = {
                    ...vars,
                    "--color-page": vars["--color-primary-light"] || "#2596be",
                    "--color-primary": vars["--color-golden"] || "#FC883E",
                  };
                  setVars(preset);
                  applyAll(preset);
                  persist(preset);
                }}
                className="rounded-full px-3 py-2 bg-secondary text-white font-body font-semibold hover:bg-secondary-light transition-colors"
                style={{ fontSize: "0.8rem" }}
              >
                Blue preset
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

