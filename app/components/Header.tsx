import Link from "next/link";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

export default function Header() {
  return (
    <header className="bg-cream border-b border-navy/10">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-navy-dark">
              Power to the People
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy font-medium hover:text-coral transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-teal hover:after:w-full after:transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-involved"
              className="rounded-full bg-coral px-6 py-2.5 text-white font-semibold hover:bg-coral-dark transition-colors"
            >
              Get Involved
            </Link>
          </div>

          {/* Mobile menu button (placeholder) */}
          <button className="md:hidden p-2 text-navy-dark" aria-label="Menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
