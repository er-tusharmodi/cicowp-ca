import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";

// GET all topics
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    let filter: any = {};

    if (active === "true") {
      filter.isActive = true;
    }

    const topics = await Topic.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ success: true, data: topics });
  } catch (error: any) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// POST create new topic
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const body = await request.json();

    const topic = await Topic.create({
      ...body,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
