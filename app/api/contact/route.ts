import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";
import Visitor from "@/models/Visitor";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { fullName, mobile, email, subject, message } = body;

    if (!fullName || !mobile || !subject || !message) {
      return NextResponse.json(
        { error: "Full name, mobile, subject, and message are required" },
        { status: 400 },
      );
    }

    // Create contact submission
    await ContactSubmission.create({
      fullName,
      mobile,
      email: email || undefined,
      subject,
      message,
    });

    // Log visitor
    try {
      const ip =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const userAgent = request.headers.get("user-agent") || "";

      await Visitor.create({
        ip,
        page: "/contact",
        timestamp: new Date(),
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log visitor:", logError);
    }

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully. We will get back to you soon.",
    });
  } catch (error: any) {
    console.error("Contact submission error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to submit your message. Please try again." },
      { status: 500 },
    );
  }
}
