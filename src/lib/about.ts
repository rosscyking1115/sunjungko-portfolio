import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ABOUT_PATH = path.join(process.cwd(), "content", "about.mdx");

export function loadAbout(): string {
  const raw = fs.readFileSync(ABOUT_PATH, "utf8");
  const { content } = matter(raw);
  return content;
}
