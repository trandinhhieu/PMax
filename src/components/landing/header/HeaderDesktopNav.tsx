"use client";

type HeaderDesktopNavProps = {
  isScrolled: boolean;
  links: Array<{ href: string; label: string }>;
};

export function HeaderDesktopNav({ isScrolled, links }: HeaderDesktopNavProps) {
  return (
    <nav aria-label="Main navigation" className={`hidden items-center gap-6 text-sm font-semibold lg:flex ${isScrolled ? "text-charcoal" : "text-white"}`}>
      {links.map((link) => (
        <a className="underline-offset-8 transition hover:text-fire hover:underline" href={link.href} key={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
