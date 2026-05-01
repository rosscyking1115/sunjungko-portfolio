import Link from "next/link";
import { Download } from "lucide-react";

export function CvDownload() {
  return (
    <Link
      href="/cv.pdf"
      download="SunJung-Ko-CV.pdf"
      className="border-foreground hover:border-accent hover:text-accent inline-flex items-center gap-2 border-b py-1 text-sm transition-colors print:hidden"
    >
      <Download className="h-4 w-4" aria-hidden />
      Download CV (PDF)
    </Link>
  );
}
