import { siteConfig } from "./site-config";
import type { CaseStudyMeta } from "@/types/case-study";

/**
 * JSON-LD structured data helpers. Stringify the result and drop into a
 * <script type="application/ld+json"> tag. Keeps the schema definitions in
 * one place so /about and /work/[slug] don't drift apart.
 */

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.fullName,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [siteConfig.socials.linkedin],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University of Sheffield",
      url: "https://www.sheffield.ac.uk",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sheffield",
      addressRegion: "South Yorkshire",
      addressCountry: "GB",
    },
    knowsAbout: [
      "Brand strategy",
      "Marketing strategy",
      "Market research",
      "Consumer behaviour",
      "Brand audits",
      "Segmentation",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.fullName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "en-GB",
    author: {
      "@type": "Person",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  };
}

export function articleSchema(study: CaseStudyMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    datePublished: study.publishedAt,
    author: {
      "@type": "Person",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.fullName,
    },
    url: `${siteConfig.url}/work/${study.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/work/${study.slug}`,
    },
    keywords: study.frameworks?.join(", "),
  };
}

export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: personSchema(),
  };
}
