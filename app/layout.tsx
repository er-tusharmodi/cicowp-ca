import type { Metadata } from "next";
import { Public_Sans, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Setting from "@/models/Setting";
import dbConnect from "@/lib/mongodb";

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

export async function generateMetadata(): Promise<Metadata> {
  const fallback: Metadata = {
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

  try {
    await dbConnect();
    const settings = await Setting.find({
      key: { $in: ["site_favicon", "site_name", "site_description"] },
    }).lean();

    const lookup = settings.reduce<Record<string, any>>((acc, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    const faviconUrl = lookup.site_favicon || undefined;
    const title = lookup.site_name
      ? `${lookup.site_name} - Canadian Immigration & Work Permit Status`
      : fallback.title;
    const description = lookup.site_description || fallback.description;

    return {
      ...fallback,
      title,
      description,
      icons: faviconUrl ? { icon: faviconUrl } : undefined,
    };
  } catch (error) {
    return fallback;
  }
}

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
