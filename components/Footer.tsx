import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-ink text-mist">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <section>
          <h3 className="font-display text-lg font-semibold">About</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist/80">
            Cicowp-ca | Write Whatever Your Heart Wants. A structured hub for
            public service links.
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
            <a
              className="transition hover:text-white"
              href="https://www.canada.ca/en/government/dept.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Departments and agencies
            </a>
            <a
              className="transition hover:text-white"
              href="https://www.canada.ca/en/news.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              News
            </a>
            <a
              className="transition hover:text-white"
              href="https://open.canada.ca/en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Government
            </a>
            <a
              className="transition hover:text-white"
              href="https://www.pm.gc.ca/en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Prime Minister
            </a>
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="mx-auto max-w-7xl px-4 text-xs text-mist/70 sm:px-6 lg:px-8">
          {currentYear} Cicowp-ca. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
