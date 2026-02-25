import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

// GET all pages
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const showInNav = searchParams.get("showInNav");

    let filter: any = {};

    if (published === "true") {
      filter.isPublished = true;
    }

    if (showInNav === "true") {
      filter.showInNav = true;
      filter.isPublished = true;
    }

    const pages = await Page.find(filter)
      .sort({ navOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// POST create new page
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

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug: body.slug });
    if (existingPage) {
      return NextResponse.json(
        { success: false, message: "A page with this slug already exists" },
        { status: 400 },
      );
    }

    const page = await Page.create({
      ...body,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
