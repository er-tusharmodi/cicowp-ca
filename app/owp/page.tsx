"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OWPPage() {
  useEffect(() => {
    // Reveal animation observer
    const revealItems = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    return () => {
      revealItems.forEach((item) => revealObserver.unobserve(item));
    };
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="reveal lg:col-span-7">
              <p className="inline-flex rounded-full border border-sky/30 bg-sky/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky">
                OWP Guide
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                What is an open work permit?
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/75 sm:text-lg">
                An open work permit is not job-specific. It generally allows
                work for any employer for a period of time, subject to
                immigration rules and restrictions.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                    LMIA
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    Usually not required
                  </p>
                </div>
                <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                    Employer
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    Not job-specific
                  </p>
                </div>
                <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                    Restrictions
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    May apply by case
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-3 shadow-soft">
                <img
                  src="https://cicowp-ca.com/public/images/1710757242_d5198760e363a0011486.jpeg"
                  alt="Open work permit overview"
                  className="h-72 w-full rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <article className="reveal space-y-6 lg:col-span-8">
            <section
              id="overview"
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Overview
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                <p>
                  Because open work permits are not job-specific, applicants
                  typically do not need a Labour Market Impact Assessment
                  (LMIA), and generally do not need employer-portal offer
                  details tied to one employer.
                </p>
                <p>
                  In many cases, the open work permit holder fee is paid
                  together with the work permit fee.
                </p>
              </div>
            </section>

            <section
              id="important"
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Important conditions
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/80 sm:text-base">
                Even when employer name is unrestricted, temporary residents
                remain subject to IRPR conditions. Work is restricted for
                employers or services listed under relevant regulations.
              </p>
              <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-ink/80 sm:text-base space-y-2">
                <li>
                  Restrictions can apply under IRPR subsection 183(1) and
                  related clauses.
                </li>
                <li>
                  Certain employer categories and services are explicitly
                  prohibited.
                </li>
              </ul>
            </section>

            <section
              id="types"
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Types of open work permits
              </h2>
              <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-ink/80 sm:text-base space-y-2">
                <li>
                  <strong>Unrestricted:</strong> work in any occupation and
                  location.
                </li>
                <li>
                  <strong>Restricted:</strong> occupation or location
                  restrictions may apply.
                </li>
                <li>
                  Medical and category-based restrictions may be added where
                  required.
                </li>
              </ul>
            </section>

            <section
              id="coding"
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Coding and processing notes
              </h2>
              <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-ink/80 sm:text-base space-y-2">
                <li>
                  Employer and location may be marked unspecified/unknown for
                  unrestricted open permits.
                </li>
                <li>
                  Occupation may be coded under NOC 9999 where applicable.
                </li>
                <li>
                  Medical results and surveillance requirements can affect
                  permit conditions.
                </li>
              </ul>
            </section>

            <section
              id="medical"
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Medical condition examples
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/80 sm:text-base">
                Where no medical exam was completed, restrictions may be applied
                based on whether a person has lived in a designated or
                non-designated country.
              </p>
              <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-ink/80 sm:text-base space-y-2">
                <li>
                  Restrictions often include child care, primary/secondary
                  teaching, and health service occupations.
                </li>
                <li>
                  Additional agriculture restrictions may apply depending on
                  country designation.
                </li>
              </ul>
            </section>
          </article>

          <aside className="reveal space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
              <h3 className="font-display text-xl font-semibold text-ink">
                On this page
              </h3>
              <nav className="mt-4 grid gap-2 text-sm">
                <a
                  className="rounded-xl bg-mist px-3 py-2 transition hover:bg-white hover:shadow-soft"
                  href="#overview"
                >
                  Overview
                </a>
                <a
                  className="rounded-xl bg-mist px-3 py-2 transition hover:bg-white hover:shadow-soft"
                  href="#important"
                >
                  Important conditions
                </a>
                <a
                  className="rounded-xl bg-mist px-3 py-2 transition hover:bg-white hover:shadow-soft"
                  href="#types"
                >
                  Types
                </a>
                <a
                  className="rounded-xl bg-mist px-3 py-2 transition hover:bg-white hover:shadow-soft"
                  href="#coding"
                >
                  Coding notes
                </a>
                <a
                  className="rounded-xl bg-mist px-3 py-2 transition hover:bg-white hover:shadow-soft"
                  href="#medical"
                >
                  Medical conditions
                </a>
              </nav>
            </div>

            <div className="rounded-3xl border border-sky/30 bg-sky/5 p-6">
              <h3 className="font-display text-xl font-semibold text-ink">
                Official references
              </h3>
              <div className="mt-4 grid gap-2 text-sm">
                <a
                  className="rounded-xl bg-white px-3 py-2 transition hover:border hover:border-sky/30"
                  href="http://www.cic.gc.ca/english/information/fees/fees.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IRCC fee list
                </a>
                <a
                  className="rounded-xl bg-white px-3 py-2 transition hover:border hover:border-sky/30"
                  href="http://laws-lois.justice.gc.ca/eng/regulations/SOR-2002-227/section-183.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IRPR 183(1)
                </a>
                <a
                  className="rounded-xl bg-white px-3 py-2 transition hover:border hover:border-sky/30"
                  href="http://laws-lois.justice.gc.ca/eng/regulations/SOR-2002-227/section-200.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IRPR 200
                </a>
                <a
                  className="rounded-xl bg-white px-3 py-2 transition hover:border hover:border-sky/30"
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/medical-police/medical-exams/requirements-temporary-residents/country-requirements.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Country medical requirements
                </a>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
