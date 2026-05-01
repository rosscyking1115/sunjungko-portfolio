import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  caseStudyFrontmatterSchema,
  type CaseStudy,
  type CaseStudyMeta,
} from "@/types/case-study";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

function listFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
}

function readOne(filename: string): CaseStudy {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  // Validate frontmatter — throws with a useful Zod error if a field is wrong.
  const parsed = caseStudyFrontmatterSchema.parse(data);

  // Sanity-check: filename slug must match frontmatter slug.
  const fileSlug = filename.replace(/\.mdx$/, "");
  if (parsed.slug !== fileSlug) {
    throw new Error(
      `Slug mismatch in ${filename}: frontmatter says "${parsed.slug}" but filename is "${fileSlug}"`,
    );
  }

  return {
    ...parsed,
    readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    content,
  };
}

/**
 * Re-reads from disk on every call. With ~10 case studies this is fast enough
 * and avoids stale-cache surprises in dev when MDX files change.
 */
function loadAll(): CaseStudy[] {
  const studies = listFiles().map(readOne);
  // Newest first by publishedAt.
  studies.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return studies;
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  // CaseStudy structurally extends CaseStudyMeta; the returned objects will
  // carry an extra `content` field but consumers typed as CaseStudyMeta won't
  // see it. The data never crosses the network as JSON (server-only).
  return loadAll();
}

export function getFeaturedCaseStudies(): CaseStudyMeta[] {
  return getAllCaseStudies().filter((s) => s.featured);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return loadAll().find((s) => s.slug === slug);
}

export function getCaseStudySlugs(): string[] {
  return loadAll().map((s) => s.slug);
}
