import { education } from "@/lib/education";

export function EducationTimeline() {
  return (
    <ul className="space-y-8">
      {education.map((item) => (
        <li
          key={`${item.degree}-${item.institution}`}
          className="grid gap-2 md:grid-cols-[10rem_1fr] md:gap-8"
        >
          <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase md:pt-1">
            {item.period}
          </div>
          <div>
            <h3 className="font-serif text-lg tracking-tight md:text-xl">
              {item.degree}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {item.institution} · {item.location}
            </p>
            {item.detail && (
              <p className="text-foreground/85 mt-3 text-sm leading-relaxed">
                {item.detail}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
