import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Admin from "@/models/Admin";
import Case from "@/models/Case";
import Page from "@/models/Page";
import Topic from "@/models/Topic";
import Setting from "@/models/Setting";
import Visitor from "@/models/Visitor";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [admins, cases, pages, topics, settings, visitors] =
      await Promise.all([
        Admin.find().select("-passwordHash").lean(),
        Case.find().lean(),
        Page.find().lean(),
        Topic.find().lean(),
        Setting.find().lean(),
        Visitor.find().lean(),
      ]);

    const exportedAt = new Date();
    const filenameDate = exportedAt.toISOString().slice(0, 10);

    const payload = {
      exportedAt: exportedAt.toISOString(),
      collections: {
        admins,
        cases,
        pages,
        topics,
        settings,
        visitors,
      },
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="cicowp-db-${filenameDate}.json"`,
      },
    });
  } catch (error) {
    console.error("DB export error:", error);
    return NextResponse.json(
      { error: "Failed to export database" },
      { status: 500 },
    );
  }
}
