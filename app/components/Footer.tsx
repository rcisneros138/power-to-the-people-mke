import Link from "next/link";
import Image from "next/image";
import { PETITION_URL } from "../lib/links";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/get-involved", label: "Get Involved" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-cream p-1.5">
                <Image
                  src="/logo.svg"
                  alt="Power to the People logo"
                  width={32}
                  height={34}
                  className="h-8 w-auto"
                />
              </span>
              <h3 className="text-lg font-extrabold">Power to the People MKE</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              A campaign calling on the City of Milwaukee to replace We Energies
              with a municipally owned and operated utility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-coral transition-colors font-medium uppercase tracking-wide text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Petition CTA */}
          <div>
            <h3 className="text-xl mb-4">Sign The Petition</h3>
            <p className="text-white/70 text-sm mb-4">
              Add your name to demand public power for Milwaukee.
            </p>
            <a
              href={PETITION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-coral-deep text-white px-5 py-3 text-sm font-bold uppercase tracking-wide hover:bg-coral-deep-dark transition-all hover:scale-105"
            >
              Sign The Petition
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-white/70 text-sm space-y-1">
            <p>
              &copy; {new Date().getFullYear()} Power to the People Milwaukee. All rights reserved.
            </p>
            <p className="text-white/50 text-xs">
              Designed &amp; Built by{" "}
              <a
                href="https://raymondc.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-coral transition-colors"
              >
                Raymond C.
              </a>
            </p>
          </div>
          {/* The campaign has no accounts of its own; these are Milwaukee DSA's,
              which is why they are labelled rather than left as bare icons — the
              site is a coalition and these feeds belong to one member of it. */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="text-white/50 text-xs uppercase tracking-wider">
              Follow Milwaukee DSA
            </p>
            <div className="flex gap-4">
            <a
              href="https://www.facebook.com/dsamke"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 -m-3 text-white/70 hover:text-white transition-colors"
              aria-label="Milwaukee DSA on Facebook (opens in new tab)"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/mkedsa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 -m-3 text-white/70 hover:text-white transition-colors"
              aria-label="Milwaukee DSA on Instagram (opens in new tab)"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.053 1.805.249 2.227.415.56.217.96.477 1.38.896.419.42.679.82.896 1.38.166.422.362 1.057.415 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.053 1.17-.249 1.805-.415 2.227a3.72 3.72 0 01-.896 1.38 3.72 3.72 0 01-1.38.896c-.422.166-1.057.362-2.227.415-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.053-1.805-.249-2.227-.415a3.72 3.72 0 01-1.38-.896 3.72 3.72 0 01-.896-1.38c-.166-.422-.362-1.057-.415-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.053-1.17.249-1.805.415-2.227.217-.56.477-.96.896-1.38.42-.419.82-.679 1.38-.896.422-.166 1.057-.362 2.227-.415 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.332.014 7.052.072 5.775.13 4.902.333 4.14.63a5.88 5.88 0 00-2.126 1.384A5.88 5.88 0 00.63 4.14C.333 4.902.13 5.775.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.058 1.277.261 2.15.558 2.912a5.88 5.88 0 001.384 2.126A5.88 5.88 0 004.14 23.37c.762.297 1.635.5 2.912.558C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.15-.261 2.912-.558a5.88 5.88 0 002.126-1.384 5.88 5.88 0 001.384-2.126c.297-.762.5-1.635.558-2.912C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.058-1.277-.261-2.15-.558-2.912a5.88 5.88 0 00-1.384-2.126A5.88 5.88 0 0019.86.63c-.762-.297-1.635-.5-2.912-.558C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
              </svg>
            </a>
            <a
              href="https://bsky.app/profile/mkedsa.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 -m-3 text-white/70 hover:text-white transition-colors"
              aria-label="Milwaukee DSA on Bluesky (opens in new tab)"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@mke.dsa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 -m-3 text-white/70 hover:text-white transition-colors"
              aria-label="Milwaukee DSA on TikTok (opens in new tab)"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5 2.59 2.59 0 01-2.59-2.59 2.59 2.59 0 013.27-2.5V9.66a5.67 5.67 0 00-.68-.04A5.68 5.68 0 004.2 15.3a5.68 5.68 0 0010.94 2.14c.28-.68.42-1.4.42-2.14V9.01a7.35 7.35 0 004.29 1.37V7.29a4.28 4.28 0 01-3.25-1.47z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@mkedsa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 -m-3 text-white/70 hover:text-white transition-colors"
              aria-label="Milwaukee DSA on YouTube (opens in new tab)"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
              </svg>
            </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
