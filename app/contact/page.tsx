"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          fullName: "",
          mobile: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="reveal rounded-3xl border border-ink/10 bg-white/95 p-6 shadow-soft sm:p-8">
            <p className="inline-flex rounded-full border border-clay/40 bg-clay/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-clay">
              Contact
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Send us your inquiry
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/75 sm:text-lg">
              Share your request clearly and we can follow up faster. This
              refreshed page keeps your original fields and adds a cleaner
              submission flow.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="reveal lg:col-span-8">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Contact form
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 sm:grid-cols-2"
              >
                {success && (
                  <div className="sm:col-span-2 rounded-xl border border-pine/30 bg-pine/5 p-4">
                    <p className="text-sm font-semibold text-pine">
                      Thank you! Your message has been sent successfully.
                      We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="sm:col-span-2 rounded-xl border border-clay/30 bg-clay/5 p-4">
                    <p className="text-sm font-semibold text-clay">{error}</p>
                  </div>
                )}

                <div className="sm:col-span-1">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Your mobile number"
                    className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Email <span className="text-ink/50">(optional)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Your email address"
                    className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Brief subject line"
                    className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Your message here..."
                    className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-mist transition hover:bg-pine disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit"}
                    {!loading && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M3 3.5v13c0 1.378 1.622 2.15 2.746 1.31l11.5-8.5A1 1 0 0 0 17.5 8a1 1 0 0 0-.254-1.31l-11.5-8.5A1.5 1.5 0 0 0 3 3.5z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="reveal space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
              <h3 className="font-display text-xl font-semibold text-ink">
                Quick tips
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/75">
                <li className="rounded-xl bg-mist p-3">
                  Include your document or passport number if relevant.
                </li>
                <li className="rounded-xl bg-mist p-3">
                  Use a subject line that clearly describes your request.
                </li>
                <li className="rounded-xl bg-mist p-3">
                  We aim to respond within one business day.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
