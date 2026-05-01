import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { env } from "@/lib/env";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.fullName} about brand strategy, market research, and entry-level London marketing roles.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="border-border border-b">
        <Container>
          <div className="py-20 md:py-24">
            <p className="text-muted-foreground mb-6 text-xs tracking-[0.18em] uppercase">
              Contact
            </p>
            <h1 className="font-serif text-5xl leading-[1.04] tracking-tight md:text-6xl">
              Get in touch
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed">
              I&rsquo;m looking for entry-level brand strategy or market research roles
              in London from{" "}
              <strong className="text-foreground font-medium">1 October 2026</strong>.
              No employer sponsorship needed for the next two years (Graduate visa).
              Drop a message and I&rsquo;ll reply within a couple of days.
            </p>
            <p className="text-muted-foreground mt-3 text-sm">
              Or email directly:{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="border-foreground hover:text-accent hover:border-accent text-foreground border-b transition-colors"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container size="narrow">
          <ContactForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </Container>
      </section>
    </>
  );
}
