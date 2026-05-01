import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/layout/container";

export function Hero() {
  // Split "SunJung Ko (Evelyn)" → "SunJung Ko" + "(Evelyn)" so we can italicise
  // the parenthetical for the editorial feel.
  const name = siteConfig.fullName.replace(/\s*\(.+\)\s*$/, "");
  const aka = siteConfig.fullName.match(/\(([^)]+)\)/)?.[1];

  return (
    <section className="border-border border-b">
      <Container>
        <div className="grid items-start gap-12 py-20 md:grid-cols-[1fr_auto] md:gap-16 md:py-28">
          <div className="max-w-3xl">
            <p className="text-muted-foreground mb-8 text-xs tracking-[0.18em] uppercase">
              {siteConfig.role}
            </p>

            <h1 className="font-serif text-5xl leading-[1.04] tracking-tight md:text-7xl">
              {name}
              {aka ? (
                <span className="text-muted-foreground ml-3 font-light italic">
                  ({aka})
                </span>
              ) : null}
            </h1>

            <p className="text-muted-foreground mt-10 text-sm">{siteConfig.location}</p>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/work"
                className="group border-foreground text-foreground hover:border-accent hover:text-accent inline-flex items-center gap-1.5 border-b py-1 text-sm transition-colors"
              >
                Selected work
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/contact"
                className="group text-muted-foreground hover:border-accent hover:text-accent inline-flex items-center gap-1.5 border-b border-transparent py-1 text-sm transition-colors"
              >
                Get in touch
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>

          <div className="md:pt-3">
            <div className="relative aspect-[4/5] w-32 overflow-hidden rounded-sm shadow-sm md:w-44">
              <Image
                src="/img/headshot-hero.jpg"
                alt={`Portrait of ${siteConfig.fullName}`}
                fill
                priority
                sizes="(min-width: 768px) 176px, 128px"
                className="object-cover"
              />
            </div>
            <p className="text-muted-foreground mt-3 max-w-44 text-[10px] tracking-[0.18em] uppercase">
              Sheffield → London
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
