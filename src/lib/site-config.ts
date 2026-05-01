export const siteConfig = {
  name: "SunJung Ko",
  shortName: "SunJung",
  fullName: "SunJung Ko (Evelyn)",
  role: "Marketing Strategy & Research",
  tagline: "Brand thinking, grounded in research.",
  location: "Sheffield, UK · London from October 2026",
  email: "sunjungko0914@gmail.com",
  url: "https://evelynsjko.com",
  description:
    "MSc Marketing & Branding graduate from the University of Sheffield. Brand strategy and market research, available for entry-level roles in London from October 2026.",
  keywords: [
    "Marketing strategy",
    "Brand strategy",
    "Market research",
    "Consumer behaviour",
    "Brand evaluation",
    "MSc Marketing and Branding",
    "University of Sheffield",
    "London",
    "Brand audit",
    "Segmentation",
  ],
  nav: [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  socials: {
    linkedin: "https://www.linkedin.com/in/sunjungko0914/",
    email: "mailto:sunjungko0914@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
