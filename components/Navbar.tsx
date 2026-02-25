"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DynamicPage {
  _id: string;
  title: string;
  slug: string;
  showInNav: boolean;
  navOrder: number;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dynamicPages, setDynamicPages] = useState<DynamicPage[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetchNavigationPages();
  }, []);

  const fetchNavigationPages = async () => {
    try {
      const response = await fetch("/api/pages?published=true&showInNav=true");
      if (response.ok) {
        const result = await response.json();
        setDynamicPages(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch navigation pages:", error);
    }
  };

  const staticNavigation = [
    { name: "Home", href: "/", key: "home" },
    { name: "Check Status", href: "/check-status", key: "check" },
    { name: "OWP", href: "/owp", key: "owp" },
  ];

  const allNavigation = [
    ...staticNavigation,
    ...dynamicPages.map((page) => ({
      name: page.title,
      href: `/pages/${page.slug}`,
      key: `page-${page._id}`,
    })),
    { name: "Contact", href: "/contact", key: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-mist/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-sm font-bold text-mist transition group-hover:bg-pine">
            CA
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Cicowp-ca
          </span>
        </Link>

        <button
          id="menuButton"
          className="inline-flex items-center justify-center rounded-lg border border-ink/20 p-2 text-ink md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobileMenu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <nav
          className="hidden items-center gap-1 text-sm font-medium md:flex"
          aria-label="Main navigation"
        >
          {allNavigation.slice(0, -1).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                pathname === item.href
                  ? "rounded-full bg-ink px-4 py-2 text-mist"
                  : "rounded-full px-4 py-2 text-ink/80 hover:bg-white hover:text-ink"
              }
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className={
              pathname === "/contact"
                ? "rounded-full bg-pine px-5 py-2.5 text-mist transition"
                : "rounded-full bg-ink px-5 py-2.5 text-mist transition hover:bg-pine"
            }
          >
            Contact
          </Link>
        </nav>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobileMenu"
          className="border-t border-ink/10 px-4 pb-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-4 text-sm font-medium">
            {allNavigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  pathname === item.href
                    ? "rounded-lg bg-white px-4 py-2"
                    : "rounded-lg px-4 py-2 hover:bg-white"
                }
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
