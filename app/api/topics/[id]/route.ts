import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";

// GET single topic by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const topic = await Topic.findById(params.id);

    if (!topic) {
      return NextResponse.json(
        { success: false, message: "Topic not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error: any) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// PUT update topic by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const topic = await Topic.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, message: "Topic not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error: any) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// DELETE topic by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const topic = await Topic.findByIdAndDelete(params.id);

    if (!topic) {
      return NextResponse.json(
        { success: false, message: "Topic not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
