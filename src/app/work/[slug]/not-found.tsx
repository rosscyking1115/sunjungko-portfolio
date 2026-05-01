import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container size="narrow">
      <div className="py-32 text-center">
        <p className="text-muted-foreground mb-4 text-xs tracking-[0.18em] uppercase">
          404
        </p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
          Case study not found
        </h1>
        <p className="text-muted-foreground mt-6">
          That case study doesn&rsquo;t exist or has been moved.
        </p>
        <Link
          href="/work"
          className="border-foreground hover:text-accent hover:border-accent mt-10 inline-flex border-b py-1 text-sm transition-colors"
        >
          See all work →
        </Link>
      </div>
    </Container>
  );
}
