import type { Metadata } from "next";
import { Public_Sans, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Cicowp-ca.com - Canadian Immigration & Work Permit Status",
  description:
    "A cleaner, faster front door for Canadian public information. Check your Open Work Permit status and access government services.",
  keywords: [
    "Canada",
    "immigration",
    "work permit",
    "OWP",
    "status check",
    "government services",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${publicSans.variable} ${sora.variable} page-glow antialiased font-body`}
      >
        <div className="texture pointer-events-none fixed inset-0 z-[-2]"></div>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
