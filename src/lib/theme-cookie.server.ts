import "server-only";
import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "./theme-cookie";

export async function getServerTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;
  return value === "dark" ? "dark" : "light";
}
