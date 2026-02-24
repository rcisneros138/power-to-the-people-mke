"use client";

import { useState, useEffect, useCallback } from "react";
import NavLink from "./NavLink";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger / Close button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-navy"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-navy/30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        className={`absolute top-full left-0 right-0 bg-cream border-b border-navy/10 shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-navy hover:text-coral transition-colors font-medium text-lg uppercase tracking-wider py-2 border-b border-navy/5"
                activeClassName="text-coral"
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              href="/get-involved"
              onClick={close}
              className="rounded-full bg-coral px-6 py-3 text-white font-medium text-center uppercase tracking-wider hover:bg-coral-dark transition-colors mt-2"
            >
              Get Involved
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
