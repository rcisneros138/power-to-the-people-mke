import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

export default function Header() {
  return (
    <header className="bg-cream border-b border-navy/10 relative">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Power to the People logo"
                width={80}
                height={85}
                className="h-20 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex md:items-center md:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className="text-navy hover:text-coral transition-colors font-medium text-sm uppercase tracking-wider"
                activeClassName="text-coral"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Get Involved CTA */}
          <div className="hidden md:flex flex-1 justify-end">
            <Link
              href="/get-involved"
              className="rounded-full bg-coral px-6 py-2.5 text-white font-medium text-sm uppercase tracking-wider hover:bg-coral-dark transition-colors inline-flex items-center gap-2"
            >
              Get Involved
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>
          </div>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
