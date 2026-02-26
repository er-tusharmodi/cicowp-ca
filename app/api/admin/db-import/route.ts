import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Case from "@/models/Case";
import Topic from "@/models/Topic";
import Page from "@/models/Page";
import Setting from "@/models/Setting";
import Admin from "@/models/Admin";
import Visitor from "@/models/Visitor";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.collections) {
      return NextResponse.json(
        { error: "Invalid format: missing collections" },
        { status: 400 },
      );
    }

    await dbConnect();

    const results = {
      admins: { imported: 0, skipped: 0 },
      cases: { imported: 0, skipped: 0 },
      pages: { imported: 0, skipped: 0 },
      topics: { imported: 0, skipped: 0 },
      settings: { imported: 0, skipped: 0 },
      visitors: { imported: 0, skipped: 0 },
    };

    // Import Admins (skip if email already exists)
    if (body.collections.admins && Array.isArray(body.collections.admins)) {
      for (const admin of body.collections.admins) {
        const exists = await Admin.findOne({ email: admin.email });
        if (!exists) {
          await Admin.create(admin);
          results.admins.imported++;
        } else {
          results.admins.skipped++;
        }
      }
    }

    // Import Cases (skip if documentNumber + passportNumber already exists)
    if (body.collections.cases && Array.isArray(body.collections.cases)) {
      for (const caseData of body.collections.cases) {
        const exists = await Case.findOne({
          documentNumber: caseData.documentNumber,
          passportNumber: caseData.passportNumber,
        });
        if (!exists) {
          await Case.create(caseData);
          results.cases.imported++;
        } else {
          results.cases.skipped++;
        }
      }
    }

    // Import Pages (skip if slug already exists)
    if (body.collections.pages && Array.isArray(body.collections.pages)) {
      for (const page of body.collections.pages) {
        const exists = await Page.findOne({ slug: page.slug });
        if (!exists) {
          await Page.create(page);
          results.pages.imported++;
        } else {
          results.pages.skipped++;
        }
      }
    }

    // Import Topics
    if (body.collections.topics && Array.isArray(body.collections.topics)) {
      for (const topic of body.collections.topics) {
        await Topic.create(topic);
        results.topics.imported++;
      }
    }

    // Import Settings (update if exists, create if not)
    if (body.collections.settings && Array.isArray(body.collections.settings)) {
      for (const setting of body.collections.settings) {
        const exists = await Setting.findOne({ key: setting.key });
        if (exists) {
          await Setting.updateOne({ key: setting.key }, setting);
          results.settings.imported++;
        } else {
          await Setting.create(setting);
          results.settings.imported++;
        }
      }
    }

    // Import Visitors
    if (body.collections.visitors && Array.isArray(body.collections.visitors)) {
      for (const visitor of body.collections.visitors) {
        await Visitor.create(visitor);
        results.visitors.imported++;
      }
    }

    return NextResponse.json({
      message: "Database import completed",
      results,
    });
  } catch (error: any) {
    console.error("DB import error:", error);
    return NextResponse.json(
      { error: "Failed to import database", details: error.message },
      { status: 500 },
    );
  }
}
