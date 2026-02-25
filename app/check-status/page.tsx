"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDate } from "@/lib/utils";
import { ICase } from "@/types";

export default function CheckStatusPage() {
  const [documentNumber, setDocumentNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    case?: ICase;
    message?: string;
  } | null>(null);

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
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    return () => {
      revealItems.forEach((item) => revealObserver.unobserve(item));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/check-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentNumber: documentNumber.trim(),
          passportNumber: passportNumber.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 404) {
        setResult(data);
      } else {
        setResult({
          found: false,
          message: data.error || "An error occurred while searching",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setResult({
        found: false,
        message: "Failed to connect to the server. Please try again.",
      });
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
            <p className="inline-flex rounded-full border border-pine/30 bg-pine/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-pine">
              Status Lookup
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Check your document status
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/75 sm:text-lg">
              Enter your document and passport numbers to search. The form keeps
              the original query names (`text`, `text2`) for compatibility.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="reveal lg:col-span-7">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Search form
              </h2>
              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <label
                    htmlFor="text"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Document Number
                  </label>
                  <input
                    id="text"
                    name="text"
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Enter document number"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="text2"
                    className="mb-2 block text-sm font-semibold text-ink"
                  >
                    Passport Number
                  </label>
                  <input
                    id="text2"
                    name="text2"
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Enter passport number"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-ink/15 bg-mist px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-pine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-mist transition hover:bg-pine disabled:opacity-50"
                  >
                    {loading ? "Searching..." : "Search"}
                    {!loading && (
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
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="reveal space-y-6 lg:col-span-5">
            {!result && (
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold text-ink">
                  Before you search
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/75">
                  <li className="rounded-xl bg-mist p-3">
                    Use the exact document number from your letter or file.
                  </li>
                  <li className="rounded-xl bg-mist p-3">
                    Use a valid passport number with no extra spaces.
                  </li>
                  <li className="rounded-xl bg-mist p-3">
                    If no record appears, verify your entries and try again.
                  </li>
                </ul>
              </div>
            )}

            {result && !result.found && (
              <div className="rounded-3xl border border-pine/30 bg-pine/5 p-6">
                <h3 className="font-display text-xl font-semibold text-ink">
                  No case found
                </h3>
                <p className="mt-2 text-sm text-ink/80">
                  {result.message ||
                    "We could not find a case matching the provided document and passport numbers."}
                </p>
                <p className="mt-3 text-sm text-ink/70">
                  Please verify your information and try again.
                </p>
              </div>
            )}

            {result && result.found && result.case && (
              <div className="rounded-3xl border border-pine/30 bg-pine/5 p-6">
                <h3 className="font-display text-xl font-semibold text-ink">
                  Case Status:{" "}
                  <span
                    className={
                      result.case.status === "Approved"
                        ? "text-green-700"
                        : result.case.status === "Rejected"
                          ? "text-red-700"
                          : "text-sky"
                    }
                  >
                    {result.case.displayStatus || result.case.status}
                  </span>
                </h3>
              </div>
            )}
          </aside>
        </section>

        {result && result.found && result.case && (
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="reveal">
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  Case Details
                </h2>

                <div className="mt-6 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">
                      Personal Information
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Full Name
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {result.case.fullName}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Father&apos;s Name
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {result.case.fatherName}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Mother&apos;s Name
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {result.case.motherName}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Date of Birth
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {formatDate(result.case.dateOfBirth)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Sex
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {result.case.sex}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Nationality
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {result.case.nationality}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4 sm:col-span-2 lg:col-span-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Address
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {result.case.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">
                      Document Information
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Document Number
                        </p>
                        <p className="mt-1 font-mono font-semibold text-ink">
                          {result.case.documentNumber}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Issue Date
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {formatDate(result.case.documentIssueDate)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Expiry Date
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {formatDate(result.case.documentExpiryDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passport Information */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">
                      Passport Information
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Passport Number
                        </p>
                        <p className="mt-1 font-mono font-semibold text-ink">
                          {result.case.passportNumber}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Issue Date
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {formatDate(result.case.passportIssueDate)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Expiry Date
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {formatDate(result.case.passportExpiryDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Case Information */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">
                      Case Information
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          UCI/IUC Number
                        </p>
                        <p className="mt-1 font-mono font-semibold text-ink">
                          {result.case.uciNumber}
                        </p>
                      </div>
                      <div className="rounded-xl bg-mist p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                          Case Type
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {result.case.caseType}
                        </p>
                      </div>
                      {result.case.employer && (
                        <div className="rounded-xl bg-mist p-4">
                          <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                            Employer
                          </p>
                          <p className="mt-1 font-semibold text-ink">
                            {result.case.employer}
                          </p>
                        </div>
                      )}
                      {result.case.employerLocation && (
                        <div className="rounded-xl bg-mist p-4">
                          <p className="text-xs uppercase tracking-[0.12em] text-ink/55">
                            Employer Location
                          </p>
                          <p className="mt-1 font-semibold text-ink">
                            {result.case.employerLocation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {result.case.note && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">
                        Additional Notes
                      </h3>
                      <div className="mt-4 rounded-xl bg-mist p-4">
                        <p className="text-sm leading-relaxed text-ink/75">
                          {result.case.note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="e.g., AB1234567"
                    required
                    disabled={loading}
                    className="uppercase"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Case
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="animate-in">
            {result.found && result.case ? (
              <div className="space-y-6">
                {/* Status Header */}
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">Case Found</CardTitle>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          result.case.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : result.case.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : result.case.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {result.case.status}
                      </span>
                    </div>
                  </CardHeader>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{result.case.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="font-medium">
                        {formatDate(result.case.dateOfBirth)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Father&apos;s Name
                      </p>
                      <p className="font-medium">{result.case.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Mother&apos;s Name
                      </p>
                      <p className="font-medium">{result.case.motherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sex</p>
                      <p className="font-medium">{result.case.sex}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nationality
                      </p>
                      <p className="font-medium">{result.case.nationality}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{result.case.address}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Document & Passport Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Document</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Number
                          </p>
                          <p className="font-medium font-mono">
                            {result.case.documentNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Issue Date
                          </p>
                          <p className="font-medium">
                            {formatDate(result.case.documentIssueDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Expiry Date
                          </p>
                          <p className="font-medium">
                            {formatDate(result.case.documentExpiryDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Passport</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Number
                          </p>
                          <p className="font-medium font-mono">
                            {result.case.passportNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Issue Date
                          </p>
                          <p className="font-medium">
                            {formatDate(result.case.passportIssueDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Expiry Date
                          </p>
                          <p className="font-medium">
                            {formatDate(result.case.passportExpiryDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Case Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileCheck className="w-5 h-5 mr-2" />
                      Case Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        UCI/IUC Number
                      </p>
                      <p className="font-medium font-mono">
                        {result.case.uciNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Case Type</p>
                      <p className="font-medium">{result.case.caseType}</p>
                    </div>
                    {result.case.employer && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Employer
                        </p>
                        <p className="font-medium">{result.case.employer}</p>
                      </div>
                    )}
                    {result.case.employerLocation && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Employer Location
                        </p>
                        <p className="font-medium">
                          {result.case.employerLocation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {result.case.note && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {result.case.note}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="border-2 border-destructive">
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                      <Search className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No Case Found
                    </h3>
                    <p className="text-muted-foreground">
                      {result.message ||
                        "We could not find a case matching the provided document and passport numbers."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Please verify your information and try again. If you
                      believe this is an error, please{" "}
                      <Link
                        href="/contact"
                        className="text-primary hover:underline"
                      >
                        contact us
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Instructions */}
        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>Search Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                • Enter your document number exactly as it appears on your
                application
              </p>
              <p>
                • Enter your passport number exactly as it appears on your
                passport
              </p>
              <p>• Both numbers are case-insensitive</p>
              <p>
                • Ensure there are no extra spaces before or after the numbers
              </p>
              <p>
                • If you cannot find your case, please contact us for assistance
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Cicowp-ca.com. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
