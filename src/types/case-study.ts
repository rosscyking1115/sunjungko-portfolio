import { z } from "zod";

export const caseStudyFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  summary: z.string().min(1).max(280),
  category: z.enum(["Brand strategy", "Market research", "Digital", "Content"]),
  period: z.string().min(1),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  featured: z.boolean().default(false),
  client: z.string().optional(),
  role: z.string().optional(),
  duration: z.string().optional(),
  frameworks: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
});

export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;

export interface CaseStudyMeta extends CaseStudyFrontmatter {
  readingTimeMinutes: number;
}

export interface CaseStudy extends CaseStudyMeta {
  content: string;
}

export const CATEGORIES = [
  "Brand strategy",
  "Market research",
  "Digital",
  "Content",
] as const;

export type Category = (typeof CATEGORIES)[number];
