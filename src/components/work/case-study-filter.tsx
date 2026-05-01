import Link from "next/link";
import { CATEGORIES } from "@/types/case-study";
import { cn } from "@/lib/utils";

/**
 * Category filter chips. Per kit lesson L12, navigation-style filters use
 * `aria-current` (correct ARIA semantics for "this is the active page") rather
 * than `aria-pressed` (which axe-core flags on <a>/<Link> elements).
 *
 * This is a Server Component on purpose — the active state is passed in as a
 * prop from the parent page (which already reads searchParams). Avoids the
 * Next.js Suspense-boundary requirement for client useSearchParams.
 */
interface CaseStudyFilterProps {
  counts: Record<string, number>;
  active: string | null;
}

export function CaseStudyFilter({ counts, active }: CaseStudyFilterProps) {
  const items = [
    {
      label: "All work",
      value: null,
      count: Object.values(counts).reduce((a, b) => a + b, 0),
    },
    ...CATEGORIES.filter((c) => counts[c] > 0).map((c) => ({
      label: c,
      value: c,
      count: counts[c],
    })),
  ];

  return (
    <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = active === item.value;
        const href = item.value
          ? `/work?category=${encodeURIComponent(item.value)}`
          : "/work";
        return (
          <Link
            key={item.label}
            href={href}
            aria-current={isActive ? "true" : undefined}
            scroll={false}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            {item.label}
            <span
              className={cn(
                "text-xs",
                isActive ? "text-background/70" : "text-muted-foreground",
              )}
            >
              {item.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
