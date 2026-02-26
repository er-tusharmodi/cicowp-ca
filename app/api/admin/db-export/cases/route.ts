import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Case from "@/models/Case";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const cases = await Case.find().lean();

    const exportedAt = new Date();
    const filenameDate = exportedAt.toISOString().slice(0, 10);

    const payload = {
      exportedAt: exportedAt.toISOString(),
      collection: "cases",
      data: cases,
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="cicowp-cases-${filenameDate}.json"`,
      },
    });
  } catch (error) {
    console.error("Cases export error:", error);
    return NextResponse.json(
      { error: "Failed to export cases" },
      { status: 500 },
    );
  }
}
