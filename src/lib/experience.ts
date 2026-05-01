export interface ExperienceItem {
  role: string;
  organisation: string;
  location: string;
  period: string;
  /** Leave undefined for ongoing roles. */
  endPeriod?: string;
  summary: string;
  bullets: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Marketing Strategy Intern",
    organisation: "Bobbi",
    location: "Remote · UK",
    period: "April 2026",
    summary:
      "FemTech & fitness app start-up. Brought in to scope the competitive landscape and identify product directions to strengthen the brand's strategic positioning.",
    bullets: [
      "Ran a national + international competitor analysis covering 7+ apps across the FemTech and fitness category, mapping each against four benchmarking criteria: features, UX, scientific credibility, and pricing.",
      "Identified the strategic gaps the brand could credibly own — and which adjacencies were already saturated.",
      "Produced thirteen insight-driven feature recommendations spanning must-haves, growth delighters, and longer-shot bets including wearable integration, B2B partnerships, and teen user acquisition.",
    ],
  },
  {
    role: "Teaching Practicum",
    organisation: "Dongguk University",
    location: "Seoul, South Korea",
    period: "May–June 2023",
    summary:
      "Final-year practicum on the Korean Language Education BA. The first time I worked at scale on the same problem brand strategy keeps asking: how do you make one message land for many different audiences?",
    bullets: [
      "Delivered four lessons daily across ten classes, engaging 300+ students through participation-driven communication strategies.",
      "Applied audience segmentation principles via one-to-one consultations to identify individual needs and customise content.",
      "Designed learner-centred materials adapted to diverse student profiles — early evidence of the insight-to-message translation skill I now use in brand work.",
    ],
  },
];
