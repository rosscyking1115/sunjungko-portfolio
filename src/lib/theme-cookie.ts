export type Theme = "light" | "dark";

export const THEME_COOKIE = "theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function readClientTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const match = document.cookie.match(/(?:^| )theme=(light|dark)/);
  return (match?.[1] as Theme) ?? "light";
}

export function writeClientTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}
