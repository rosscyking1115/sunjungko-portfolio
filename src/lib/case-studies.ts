/**
 * Mocked case-study data for Phase 1. In Phase 2 this will be replaced by an
 * MDX loader that reads `content/case-studies/*.mdx` at build time.
 */

export interface CaseStudySummary {
  slug: string;
  title: string;
  category: string;
  period: string;
  summary: string;
  featured: boolean;
}

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "patagonia-brand-evaluation",
    title: "Brand Evaluation of Patagonia",
    category: "Brand strategy",
    period: "2026",
    summary:
      "Applied Kapferer's Brand Identity Prism and Keller's CBBE Model to evaluate Patagonia's brand equity, identity and community structure. Identified premium pricing and niche positioning as the key growth barriers and proposed three recommendations to improve market accessibility without compromising brand integrity.",
    featured: true,
  },
  {
    slug: "uk-confectionery-market-analysis",
    title: "UK Confectionery Market Analysis",
    category: "Market research",
    period: "2025",
    summary:
      "Comprehensive analysis of the £8.4bn UK confectionery industry using PESTEL and Porter's Five Forces. Defined a 'healthier indulgence' positioning targeting 18–34-year-old office workers and designed a full 4Ps marketing strategy backed by Mintel, Statista and Innova data.",
    featured: true,
  },
];

export function getFeaturedCaseStudies(): CaseStudySummary[] {
  return caseStudies.filter((s) => s.featured);
}
