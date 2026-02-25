import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import Setting from "@/models/Setting";
import dbConnect from "@/lib/mongodb";

const DEFAULT_SETTINGS = [
  // Hero Section
  {
    key: "hero_badge",
    value: "Welcome to CICOWP",
    type: "string",
    category: "hero",
    label: "Hero Badge",
    placeholder: "Badge text",
    description: "Text displayed in the hero badge",
  },
  {
    key: "hero_title",
    value: "Navigate Canadian Immigration with Confidence",
    type: "string",
    category: "hero",
    label: "Hero Title",
    placeholder: "Hero headline",
    description: "Main headline on homepage hero",
  },
  {
    key: "hero_subtitle",
    value:
      "Your trusted companion for understanding immigration programs, assessing eligibility, and planning your pathway to Canada.",
    type: "textarea",
    category: "hero",
    label: "Hero Subtitle",
    placeholder: "Hero description",
    description: "Subtitle text on hero section",
  },
  {
    key: "hero_cta_primary_text",
    value: "Start Assessment",
    type: "string",
    category: "hero",
    label: "Primary CTA Text",
    placeholder: "Button text",
  },
  {
    key: "hero_cta_primary_url",
    value: "/services",
    type: "url",
    category: "hero",
    label: "Primary CTA URL",
    placeholder: "/path-to-page",
  },
  {
    key: "hero_cta_secondary_text",
    value: "Learn More",
    type: "string",
    category: "hero",
    label: "Secondary CTA Text",
    placeholder: "Button text",
  },
  {
    key: "hero_cta_secondary_url",
    value: "/about",
    type: "url",
    category: "hero",
    label: "Secondary CTA URL",
    placeholder: "/path-to-page",
  },
  {
    key: "hero_image",
    value: "",
    type: "image",
    category: "hero",
    label: "Hero Image",
    description: "Background or side image for the hero section",
    placeholder: "Upload an image",
  },
  {
    key: "hero_image_secondary",
    value: "",
    type: "image",
    category: "hero",
    label: "Hero Image (Secondary)",
    description: "Second image displayed in the hero card",
    placeholder: "Upload an image",
  },

  // Stats Section
  {
    key: "stat_1_number",
    value: "50k+",
    type: "string",
    category: "stats",
    label: "Stat 1 - Number",
    placeholder: "e.g., 50k+",
  },
  {
    key: "stat_1_label",
    value: "People Helped",
    type: "string",
    category: "stats",
    label: "Stat 1 - Label",
    placeholder: "e.g., People Helped",
  },
  {
    key: "stat_1_description",
    value: "Successfully guided through immigration process",
    type: "string",
    category: "stats",
    label: "Stat 1 - Description",
    placeholder: "Stat description",
  },
  {
    key: "stat_2_number",
    value: "15+",
    type: "string",
    category: "stats",
    label: "Stat 2 - Number",
    placeholder: "e.g., 15+",
  },
  {
    key: "stat_2_label",
    value: "Programs Covered",
    type: "string",
    category: "stats",
    label: "Stat 2 - Label",
    placeholder: "e.g., Programs Covered",
  },
  {
    key: "stat_2_description",
    value: "Federal, provincial, and specialized pathways",
    type: "string",
    category: "stats",
    label: "Stat 2 - Description",
    placeholder: "Stat description",
  },
  {
    key: "stat_3_number",
    value: "98%",
    type: "string",
    category: "stats",
    label: "Stat 3 - Number",
    placeholder: "e.g., 98%",
  },
  {
    key: "stat_3_label",
    value: "Satisfaction Rate",
    type: "string",
    category: "stats",
    label: "Stat 3 - Label",
    placeholder: "e.g., Satisfaction Rate",
  },
  {
    key: "stat_3_description",
    value: "From users finding their ideal pathway",
    type: "string",
    category: "stats",
    label: "Stat 3 - Description",
    placeholder: "Stat description",
  },

  // Quick Links
  {
    key: "quicklinks_data",
    value: JSON.stringify([
      { text: "Work in Canada", href: "/work" },
      { text: "Study in Canada", href: "/study" },
      { text: "Business Immigration", href: "/business" },
      { text: "Family Class", href: "/family" },
    ]),
    type: "json",
    category: "quicklinks",
    label: "Quick Links",
    description: "JSON array of {text, href} objects",
  },

  // Footer Section
  {
    key: "footer_about_title",
    value: "About CICOWP",
    type: "string",
    category: "footer",
    label: "About Section Title",
    placeholder: "e.g., About CICOWP",
  },
  {
    key: "footer_about_text",
    value:
      "CICOWP is dedicated to demystifying Canadian immigration. We provide clear information, assessment tools, and resources to help you navigate your immigration journey.",
    type: "textarea",
    category: "footer",
    label: "About Section Text",
    placeholder: "About description",
  },
  {
    key: "footer_copyright",
    value: "© 2026 CICOWP. All rights reserved.",
    type: "string",
    category: "footer",
    label: "Copyright Text",
    placeholder: "e.g., © 2026 Company Name",
  },
  {
    key: "footer_useful_links",
    value: JSON.stringify([
      {
        text: "Departments and agencies",
        href: "https://www.canada.ca/en/government/dept.html",
      },
      { text: "News", href: "https://www.canada.ca/en/news.html" },
      { text: "Open Government", href: "https://open.canada.ca/en" },
      { text: "Prime Minister", href: "https://www.pm.gc.ca/en" },
    ]),
    type: "json",
    category: "footer",
    label: "Useful Links",
    description:
      "JSON array of {text, href} objects for footer useful links section",
  },

  // General Settings
  {
    key: "site_name",
    value: "CICOWP - Canadian Immigration",
    type: "string",
    category: "general",
    label: "Site Name",
    placeholder: "Your site name",
  },
  {
    key: "site_logo",
    value: "",
    type: "image",
    category: "general",
    label: "Site Logo",
    description: "Logo displayed in the top navigation",
    placeholder: "Upload a logo image",
  },
  {
    key: "site_favicon",
    value: "",
    type: "image",
    category: "general",
    label: "Site Favicon",
    description: "Browser tab icon",
    placeholder: "Upload a favicon",
  },
  {
    key: "site_description",
    value: "Navigate Canadian immigration programs with confidence",
    type: "textarea",
    category: "general",
    label: "Site Description",
    placeholder: "Site tagline or description",
  },
  {
    key: "site_email",
    value: "info@cicowp-ca.com",
    type: "string",
    category: "general",
    label: "Contact Email",
    placeholder: "contact@example.com",
  },

  // SEO Settings
  {
    key: "seo_meta_title",
    value: "CICOWP | Navigate Canadian Immigration with Confidence",
    type: "string",
    category: "seo",
    label: "Meta Title",
    placeholder: "Page title for search engines",
  },
  {
    key: "seo_meta_description",
    value:
      "Your trusted companion for understanding immigration programs, assessing eligibility, and planning your pathway to Canada.",
    type: "textarea",
    category: "seo",
    label: "Meta Description",
    placeholder: "Description for search engines",
  },
  {
    key: "seo_meta_keywords",
    value: "Canadian immigration, visa, pathway, assessment, programs",
    type: "string",
    category: "seo",
    label: "Meta Keywords",
    placeholder: "Comma-separated keywords",
  },
];

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check if settings already exist
    const existingSettings = await Setting.countDocuments();

    // Allow initialization if no settings exist OR if user is admin
    const session = await getServerSession(authOptions);
    if (existingSettings > 0 && (!session || session.user?.role !== "admin")) {
      return NextResponse.json(
        { error: "Settings already initialized" },
        { status: 400 },
      );
    }

    // Clear existing settings if re-initializing as admin
    if (existingSettings > 0 && session?.user?.role === "admin") {
      await Setting.deleteMany({});
    }

    // Insert default settings
    const inserted = await Setting.insertMany(DEFAULT_SETTINGS);

    return NextResponse.json(
      { message: "Settings initialized successfully", count: inserted.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/settings/init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize settings" },
      { status: 500 },
    );
  }
}
