import Link from "next/link";

const footerLinks = [
  { label: "이용약관", href: "#terms" },
  { label: "개인정보처리방침", href: "#privacy" },
  { label: "문의하기", href: "#contact" },
  { label: "블로그", href: "#blog" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>© 2026 노마드코리아. All rights reserved.</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
