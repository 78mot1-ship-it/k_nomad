import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "도시", href: "#cities" },
  { label: "지도", href: "#map" },
  { label: "밋업", href: "#community" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl" aria-hidden>
            🏠
          </span>
          <span className="text-base font-semibold tracking-tight">
            노마드코리아
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="#login">로그인</Link>}
          />
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="#signup">무료 가입</Link>}
          />
        </div>
      </div>
    </header>
  );
}
