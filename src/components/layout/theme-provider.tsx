"use client";

import * as React from "react";
import { readClientTheme, writeClientTheme, type Theme } from "@/lib/theme-cookie";

/**
 * Cookie-based theme via useSyncExternalStore.
 *
 * Per kit lessons L4 + L5:
 *  - L4: do NOT use next-themes on React 19 (FOUC / hydration warnings).
 *  - L5: do NOT do useEffect(() => setMounted(true), []) — that pattern is now
 *    flagged by react-hooks/set-state-in-effect. We subscribe to a tiny event
 *    bus over document.cookie via useSyncExternalStore.
 */

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return readClientTheme();
}

// SSR fallback — actual server value is set on <html> by the root layout.
function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme(): readonly [Theme, (next: Theme) => void] {
  const theme = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = React.useCallback((next: Theme) => {
    writeClientTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    emit();
  }, []);
  return [theme, setTheme] as const;
}
