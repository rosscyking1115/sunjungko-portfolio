import { skills } from "@/lib/skills";

export function SkillsCluster() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {skills.map((group) => (
        <div key={group.label}>
          <h3 className="text-muted-foreground mb-4 text-[10px] tracking-[0.18em] uppercase">
            {group.label}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="border-border text-foreground/85 rounded-full border px-3 py-1 text-xs"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
