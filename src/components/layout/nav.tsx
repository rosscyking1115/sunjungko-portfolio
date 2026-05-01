"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="hover:text-accent font-serif text-lg tracking-tight transition-colors"
          >
            {siteConfig.shortName}
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <span aria-hidden className="bg-border mx-1 h-5 w-px sm:mx-2" />
            <ThemeToggle />
          </nav>
        </div>
      </Container>
    </header>
  );
}
