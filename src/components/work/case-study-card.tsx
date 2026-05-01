import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudyMeta } from "@/types/case-study";

export function CaseStudyCard({ study }: { study: CaseStudyMeta }) {
  return (
    <li>
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
  );
}
