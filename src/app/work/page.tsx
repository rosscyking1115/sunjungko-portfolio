import type { Metadata } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { CATEGORIES, type Category } from "@/types/case-study";
import { Container } from "@/components/layout/container";
import { CaseStudyCard } from "@/components/work/case-study-card";
import { CaseStudyFilter } from "@/components/work/case-study-filter";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected case studies in brand strategy and market research from SunJung Ko's MSc Strategic Marketing & Branding portfolio.",
};

interface WorkPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const studies = getAllCaseStudies();
  const params = await searchParams;
  const filter = params.category as Category | undefined;

  const counts: Record<string, number> = {};
  for (const c of CATEGORIES) counts[c] = 0;
  for (const s of studies) counts[s.category]++;

  const filtered = filter ? studies.filter((s) => s.category === filter) : studies;

  return (
    <>
      <section className="border-border border-b">
        <Container>
          <div className="py-20 md:py-24">
            <p className="text-muted-foreground mb-6 text-xs tracking-[0.18em] uppercase">
              Work · {studies.length} {studies.length === 1 ? "study" : "studies"}
            </p>
            <h1 className="font-serif text-5xl leading-[1.04] tracking-tight md:text-6xl">
              Selected work
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed">
              Case studies from MSc coursework and an industry placement. Each project
              documents the question, the method, and the recommendations &mdash; not
              just the outcome.
            </p>
            <div className="mt-10">
              <CaseStudyFilter counts={counts} active={filter ?? null} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground">
              No case studies in this category yet.
            </p>
          ) : (
            <ul className="grid gap-x-12 gap-y-16 md:grid-cols-2">
              {filtered.map((study) => (
                <CaseStudyCard key={study.slug} study={study} />
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
