import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-border mt-32 border-t py-12">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-sm">{siteConfig.fullName}</p>
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} · {siteConfig.location}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={siteConfig.socials.email}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email SunJung Ko"
            >
              <Mail className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
