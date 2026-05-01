import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { siteConfig } from "@/lib/site-config";
import { loadAbout } from "@/lib/about";
import { Container } from "@/components/layout/container";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { EducationTimeline } from "@/components/about/education-timeline";
import { SkillsCluster } from "@/components/about/skills-cluster";
import { CvDownload } from "@/components/about/cv-download";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.fullName} — ${siteConfig.role} graduating from the University of Sheffield in September 2026, available for entry-level roles in London.`,
};

export default function AboutPage() {
  const bio = loadAbout();

  // Minimal Person JSON-LD here; the full SEO/JSON-LD pass lives in Phase 7.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.fullName,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [siteConfig.socials.linkedin],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University of Sheffield",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sheffield",
      addressCountry: "GB",
    },
  };

  return (
    <>
      {/* Hero */}
      <section className="border-border border-b">
        <Container>
          <div className="grid items-start gap-12 py-20 md:grid-cols-[1fr_auto] md:gap-16 md:py-24">
            <div className="max-w-3xl">
              <p className="text-muted-foreground mb-6 text-xs tracking-[0.18em] uppercase">
                About
              </p>
              <h1 className="font-serif text-5xl leading-[1.04] tracking-tight md:text-6xl">
                {siteConfig.fullName}
              </h1>
              <p className="text-muted-foreground mt-6 text-base">
                {siteConfig.role} · {siteConfig.location}
              </p>
            </div>
            <div className="md:pt-2">
              <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-sm shadow-sm md:w-56">
                <Image
                  src="/img/headshot.jpg"
                  alt={`Portrait of ${siteConfig.fullName}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 224px, 160px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bio prose */}
      <section className="py-20 md:py-24">
        <Container size="narrow">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote
              source={bio}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CvDownload />
            <Link
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted-foreground hover:text-foreground border-b border-transparent py-1 text-sm transition-colors hover:border-current print:hidden"
            >
              LinkedIn ↗
            </Link>
            <Link
              href={`mailto:${siteConfig.email}`}
              className="text-muted-foreground hover:text-foreground border-b border-transparent py-1 text-sm transition-colors hover:border-current"
            >
              {siteConfig.email}
            </Link>
          </div>
        </Container>
      </section>

      {/* Experience */}
      <section className="border-border border-t py-20 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Experience</h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Where I&rsquo;ve done the work, and what I learned.
          </p>
          <div className="mt-12">
            <ExperienceTimeline />
          </div>
        </Container>
      </section>

      {/* Education */}
      <section className="border-border border-t py-20 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Education</h2>
          <div className="mt-12">
            <EducationTimeline />
          </div>
        </Container>
      </section>

      {/* Skills */}
      <section className="border-border border-t py-20 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Skills</h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Frameworks, methods, and tools I use day-to-day.
          </p>
          <div className="mt-12">
            <SkillsCluster />
          </div>
        </Container>
      </section>

      {/* JSON-LD Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}
