import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedCaseStudies } from "@/lib/case-studies";
import { Container } from "@/components/layout/container";

export function FeaturedCaseStudies() {
  const studies = getFeaturedCaseStudies();

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-12 flex items-baseline justify-between md:mb-16">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">
            Selected work
          </h2>
          <Link
            href="/work"
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            All work
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>

        <ul className="grid gap-x-12 gap-y-16 md:grid-cols-2">
          {studies.map((study) => (
            <li key={study.slug}>
              <Link
                href={`/work/${study.slug}`}
                className="group focus-visible:ring-ring focus-visible:ring-offset-background block focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
              >
                <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.18em] uppercase">
                  {study.category} · {study.period}
                </p>
                <h3 className="group-hover:text-accent font-serif text-2xl leading-tight tracking-tight transition-colors md:text-3xl">
                  {study.title}
                </h3>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  {study.summary}
                </p>
                <span className="text-foreground group-hover:border-accent group-hover:text-accent mt-5 inline-flex items-center gap-1.5 border-b border-transparent text-sm transition-colors">
                  Read case study
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
