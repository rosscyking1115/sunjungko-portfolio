import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";
import { Container } from "@/components/layout/container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    openGraph: {
      title: study.title,
      description: study.summary,
      type: "article",
      publishedTime: study.publishedAt,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <article>
      <Container size="narrow">
        <div className="py-16 md:py-24">
          <Link
            href="/work"
            className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to work
          </Link>

          <p className="text-muted-foreground mb-6 text-xs tracking-[0.18em] uppercase">
            {study.category} · {study.period} · {study.readingTimeMinutes} min read
          </p>

          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {study.title}
          </h1>

          <p className="text-foreground/80 mt-6 font-serif text-xl leading-snug italic md:text-2xl">
            {study.summary}
          </p>

          {(study.client || study.role || study.duration) && (
            <dl className="border-border mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-b py-6 text-sm sm:grid-cols-3">
              {study.client && (
                <div>
                  <dt className="text-muted-foreground mb-1 text-[10px] tracking-[0.18em] uppercase">
                    Context
                  </dt>
                  <dd>{study.client}</dd>
                </div>
              )}
              {study.role && (
                <div>
                  <dt className="text-muted-foreground mb-1 text-[10px] tracking-[0.18em] uppercase">
                    Role
                  </dt>
                  <dd>{study.role}</dd>
                </div>
              )}
              {study.duration && (
                <div>
                  <dt className="text-muted-foreground mb-1 text-[10px] tracking-[0.18em] uppercase">
                    Duration
                  </dt>
                  <dd>{study.duration}</dd>
                </div>
              )}
            </dl>
          )}

          {study.frameworks && study.frameworks.length > 0 && (
            <div className="mt-6">
              <p className="text-muted-foreground mb-3 text-[10px] tracking-[0.18em] uppercase">
                Frameworks applied
              </p>
              <ul className="flex flex-wrap gap-2">
                {study.frameworks.map((fw) => (
                  <li
                    key={fw}
                    className="border-border text-muted-foreground rounded-full border px-3 py-1 text-xs"
                  >
                    {fw}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert mt-16 max-w-none">
            <MDXRemote
              source={study.content}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>
        </div>
      </Container>
    </article>
  );
}
