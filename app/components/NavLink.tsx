"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { href, children, className = "", activeClassName = "", onClick },
  ref,
) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      ref={ref}
      href={href}
      className={`${className} ${isActive ? activeClassName : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      {children}
    </Link>
  );
});

export default NavLink;
