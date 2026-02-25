import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import Visitor from "@/models/Visitor";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { documentNumber, passportNumber } = body;

    if (!documentNumber || !passportNumber) {
      return NextResponse.json(
        { error: "Document number and passport number are required" },
        { status: 400 },
      );
    }

    // Find case with matching document and passport number
    // Only return if displayStatus is true
    const caseData = await Case.findOne({
      documentNumber: documentNumber.toUpperCase().trim(),
      passportNumber: passportNumber.toUpperCase().trim(),
      displayStatus: true,
    }).lean();

    // Log the search for analytics
    try {
      const ip =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const userAgent = request.headers.get("user-agent") || "";

      await Visitor.create({
        ip,
        page: "/check-status",
        timestamp: new Date(),
        userAgent,
      });
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error("Failed to log visitor:", logError);
    }

    if (!caseData) {
      return NextResponse.json(
        {
          found: false,
          message:
            "No case found with the provided document and passport numbers",
        },
        { status: 404 },
      );
    }

    // Return all case data (as per user requirements, all fields are public)
    return NextResponse.json({
      found: true,
      case: caseData,
    });
  } catch (error) {
    console.error("Check status error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching for your case" },
      { status: 500 },
    );
  }
}
