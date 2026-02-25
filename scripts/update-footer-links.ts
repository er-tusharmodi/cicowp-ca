import mongoose from "mongoose";
import Setting from "../models/Setting";
import dbConnect from "../lib/mongodb";

const links = [
  {
    text: "Departments and agencies",
    href: "https://www.canada.ca/en/government/dept.html",
  },
  {
    text: "Public Service And Military",
    href: "https://www.canada.ca/en/government/publicservice.html",
  },
  { text: "News", href: "https://www.canada.ca/en/news.html" },
  { text: "Open Government", href: "https://open.canada.ca/en" },
  {
    text: "Treaties, laws and regulations",
    href: "https://www.canada.ca/en/government/system/laws.html",
  },
  {
    text: "Government-wide reporting",
    href: "https://www.canada.ca/en/transparency/reporting.html",
  },
  { text: "Prime Minister", href: "https://www.pm.gc.ca/en" },
  {
    text: "About government",
    href: "https://www.canada.ca/en/government/system.html",
  },
];

async function updateFooterLinks() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    console.log("📝 Updating footer_useful_links...");
    const result = await Setting.findOneAndUpdate(
      { key: "footer_useful_links" },
      {
        key: "footer_useful_links",
        value: JSON.stringify(links),
        type: "json",
        category: "footer",
        label: "Useful Links",
        description:
          "JSON array of {text, href} objects for footer useful links section",
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    console.log("✅ Successfully updated footer_useful_links");
    console.log(`📊 Total links: ${links.length}`);
    console.log("Links:");
    links.forEach((link, idx) => {
      console.log(`  ${idx + 1}. ${link.text}`);
    });

    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error(
      "❌ Error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

updateFooterLinks();
