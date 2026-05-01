export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: "Brand strategy",
    items: [
      "Brand audits",
      "Positioning",
      "Brand identity",
      "Brand extensions",
      "Segmentation",
      "Targeting",
      "Marketing mix (4Ps)",
    ],
  },
  {
    label: "Research methods",
    items: [
      "Market research",
      "Competitor analysis",
      "Consumer behaviour",
      "PESTEL",
      "Porter's Five Forces",
      "Kapferer's Brand Identity Prism",
      "Keller's CBBE",
    ],
  },
  {
    label: "Tools",
    items: ["PowerPoint", "Excel", "Word", "Canva", "Mintel", "Statista", "Innova"],
  },
  {
    label: "Languages",
    items: ["Korean (native)", "English (fluent)"],
  },
];
