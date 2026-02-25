"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface FooterLink {
  text: string;
  href: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [usefulLinks, setUsefulLinks] = useState<FooterLink[]>([
    {
      text: "Departments and agencies",
      href: "https://www.canada.ca/en/government/dept.html",
    },
    { text: "News", href: "https://www.canada.ca/en/news.html" },
    { text: "Open Government", href: "https://open.canada.ca/en" },
    { text: "Prime Minister", href: "https://www.pm.gc.ca/en" },
  ]);
  const [aboutText, setAboutText] = useState(
    "Cicowp-ca | Write Whatever Your Heart Wants. A structured hub for public service links.",
  );
  const [copyrightText, setCopyrightText] = useState(
    `© ${currentYear} CICOWP. All rights reserved.`,
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const grouped = await response.json();

          // Get footer settings
          if (grouped.footer) {
            const footerSettings = grouped.footer;

            // Set useful links
            const usefulLinksData = footerSettings.find(
              (s: any) => s.key === "footer_useful_links",
            );
            if (usefulLinksData?.value) {
              try {
                const links =
                  typeof usefulLinksData.value === "string"
                    ? JSON.parse(usefulLinksData.value)
                    : usefulLinksData.value;
                setUsefulLinks(links);
              } catch (e) {
                console.error("Failed to parse useful links:", e);
              }
            }

            // Set about text
            const aboutData = footerSettings.find(
              (s: any) => s.key === "footer_about_text",
            );
            if (aboutData?.value) {
              setAboutText(aboutData.value);
            }

            // Set copyright text
            const copyrightData = footerSettings.find(
              (s: any) => s.key === "footer_copyright",
            );
            if (copyrightData?.value) {
              setCopyrightText(copyrightData.value);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="border-t border-ink/10 bg-ink text-mist">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <section>
          <h3 className="font-display text-lg font-semibold">About</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist/80">
            {aboutText}
          </p>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Pages</h3>
          <div className="mt-3 grid gap-2 text-sm text-mist/80">
            <Link className="transition hover:text-white" href="/">
              Home
            </Link>
            <Link className="transition hover:text-white" href="/check-status">
              Check Status
            </Link>
            <Link className="transition hover:text-white" href="/owp">
              OWP
            </Link>
            <Link className="transition hover:text-white" href="/contact">
              Contact
            </Link>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Useful Links</h3>
          <div className="mt-3 grid gap-2 text-sm text-mist/80">
            {usefulLinks.map((link, idx) => (
              <a
                key={idx}
                className="transition hover:text-white"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="mx-auto max-w-7xl px-4 text-xs text-mist/70 sm:px-6 lg:px-8">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
