"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

interface Topic {
  _id: string;
  title: string;
  description: string;
  href: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/topics?active=true");
      if (response.ok) {
        const result = await response.json();
        setTopics(result.data || []);
        setFilteredTopics(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q),
    );
    setFilteredTopics(filtered);
  }, [searchQuery]);

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
        <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="reveal space-y-8 lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-pine/30 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-pine">
              Better access to public services
            </p>

            <div className="space-y-5">
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                A cleaner, faster front door for Canadian public information.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-ink/75">
                Navigate priority government topics, check your status quickly,
                and reach OWP resources without visual clutter or outdated
                layouts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/check-status"
                className="card-shine inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-mist shadow-soft transition hover:bg-pine"
              >
                <span>Check Status</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.69l-2.72-2.72a.75.75 0 1 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06l2.72-2.72H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="/owp"
                className="inline-flex items-center gap-2 rounded-xl border border-ink/20 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-pine/40 hover:text-pine"
              >
                <span>Open OWP</span>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                  Core Navigation
                </p>
                <p className="mt-2 text-xl font-semibold text-ink">Simple</p>
              </div>
              <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                  Topic Access
                </p>
                <p className="mt-2 text-xl font-semibold text-ink">16 Areas</p>
              </div>
              <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                  Design Goal
                </p>
                <p className="mt-2 text-xl font-semibold text-ink">Readable</p>
              </div>
            </div>
          </div>

          <div className="reveal lg:col-span-5">
            <div className="relative rounded-3xl border border-ink/10 bg-white/95 p-3 shadow-soft">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="group relative overflow-hidden rounded-2xl">
                  <img
                    src="https://cicowp-ca.com/public/images/1710775539_ec11ec459e3d79b74fd5.jpeg"
                    alt="Canadian landscape"
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"></div>
                  <p className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    Community updates
                  </p>
                </div>
                <div className="group relative overflow-hidden rounded-2xl">
                  <img
                    src="https://cicowp-ca.com/public/images/1710759446_d008e85601aa6463b042.jpeg"
                    alt="Public services"
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"></div>
                  <p className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    Service access
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-ink p-5 text-mist">
                <p className="text-xs uppercase tracking-[0.12em] text-mist/70">
                  Quick links
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <a
                    href="https://www.canada.ca/en/news.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/10 px-3 py-1.5 transition hover:bg-white/20"
                  >
                    News
                  </a>
                  <a
                    href="https://open.canada.ca/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/10 px-3 py-1.5 transition hover:bg-white/20"
                  >
                    Open Government
                  </a>
                  <a
                    href="https://www.pm.gc.ca/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/10 px-3 py-1.5 transition hover:bg-white/20"
                  >
                    Prime Minister
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="reveal rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">
                  Featured Topics
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                  Find what you need faster
                </h2>
              </div>
              <label htmlFor="topicSearch" className="w-full max-w-sm">
                <span className="sr-only">Search topic</span>
                <input
                  id="topicSearch"
                  type="search"
                  placeholder="Search topics (health, taxes, travel...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                />
              </label>
            </div>

            {loading ? (
              <div className="mt-6 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pine mx-auto"></div>
                <p className="mt-4 text-sm text-ink/65">Loading topics...</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTopics.map((topic) => (
                  <a
                    key={topic._id}
                    href={topic.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group card-shine relative rounded-2xl border border-ink/10 bg-mist p-5 transition hover:-translate-y-1 hover:border-pine/35 hover:bg-white hover:shadow-soft"
                  >
                    <span className="block h-1 w-16 rounded-full bg-gradient-to-r from-pine to-sky"></span>
                    <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {topic.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pine">
                      Open topic
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 transition group-hover:translate-x-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 0 1 .75-.75h10.69l-2.72-2.72a.75.75 0 1 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06l2.72-2.72H3.75A.75.75 0 0 1 3 10Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            )}
            {!loading && filteredTopics.length === 0 && (
              <p className="mt-4 text-sm text-ink/65">
                No matching topics. Try another keyword.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
