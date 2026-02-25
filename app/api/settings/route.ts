import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import Setting from "@/models/Setting";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const category = req.nextUrl.searchParams.get("category");

    let query: any = {};
    if (category) {
      query.category = category;
    }

    console.log("Fetching settings with query:", query);
    const settings = await Setting.find(query).lean();
    console.log("Found settings:", settings.length);

    // Group by category if no specific category requested
    if (!category) {
      const grouped: Record<string, any[]> = {};
      settings.forEach((setting: any) => {
        if (!grouped[setting.category]) {
          grouped[setting.category] = [];
        }
        grouped[setting.category].push(setting);
      });
      console.log("Grouped settings:", Object.keys(grouped));
      return NextResponse.json(grouped);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      {
        error: "Failed to fetch settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!session || (role !== "admin" && role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const data = await req.json();

    // Support batch updates
    if (Array.isArray(data)) {
      const updates = await Promise.all(
        data.map((item) =>
          Setting.findOneAndUpdate(
            { key: item.key },
            { ...item },
            { new: true, upsert: true },
          ),
        ),
      );
      return NextResponse.json(updates, { status: 200 });
    }

    // Single update
    const updated = await Setting.findOneAndUpdate(
      { key: data.key },
      { ...data },
      { new: true, upsert: true },
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
