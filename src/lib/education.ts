export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  detail?: string;
}

export const education: EducationItem[] = [
  {
    degree: "MSc Strategic Marketing and Branding",
    institution: "University of Sheffield",
    location: "Sheffield, UK",
    period: "2025–2026",
    detail:
      "Brand strategy, consumer behaviour, marketing analytics, and a research-led dissertation. Triple-accredited (AMBA · AACSB · EQUIS).",
  },
  {
    degree: "Pre-Master, Business & Social Sciences",
    institution: "University of Sheffield International College",
    location: "Sheffield, UK",
    period: "Jan–Aug 2025",
  },
  {
    degree: "English Language",
    institution: "EF Language School",
    location: "Oxford, UK",
    period: "Jun–Dec 2023",
  },
  {
    degree: "BA Korean Language Education",
    institution: "Dongguk University",
    location: "Seoul, South Korea",
    period: "2020–2023",
  },
];
