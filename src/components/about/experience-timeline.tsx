import { experience } from "@/lib/experience";

export function ExperienceTimeline() {
  return (
    <ul className="space-y-12">
      {experience.map((item) => (
        <li
          key={`${item.role}-${item.organisation}`}
          className="grid gap-3 md:grid-cols-[10rem_1fr] md:gap-8"
        >
          <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase md:pt-1">
            {item.period}
          </div>
          <div>
            <h3 className="font-serif text-xl tracking-tight md:text-2xl">
              {item.role}
              <span className="text-muted-foreground"> · {item.organisation}</span>
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">{item.location}</p>
            <p className="text-foreground/85 mt-4 text-base leading-relaxed">
              {item.summary}
            </p>
            <ul className="mt-4 space-y-2 pl-4">
              {item.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="text-muted-foreground relative text-sm leading-relaxed before:absolute before:top-2 before:-left-4 before:h-1 before:w-1 before:rounded-full before:bg-current"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
