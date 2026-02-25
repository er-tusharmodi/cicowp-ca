import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Visitor from "@/models/Visitor";
import Case from "@/models/Case";
import { getSession } from "@/lib/auth";
import { startOfDay, subDays, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const today = startOfDay(now);
    const startOfWeek = subDays(today, 7);
    const startOfMonth = subDays(today, 30);

    // Get visitor counts
    const [todayVisitors, weekVisitors, monthVisitors] = await Promise.all([
      Visitor.countDocuments({ timestamp: { $gte: today } }),
      Visitor.countDocuments({ timestamp: { $gte: startOfWeek } }),
      Visitor.countDocuments({ timestamp: { $gte: startOfMonth } }),
    ]);

    // Get case counts
    const totalCases = await Case.countDocuments();
    const casesByStatus = await Case.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get daily visitors for the last 30 days
    const dailyVisitors = await Visitor.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top visited pages
    const topPages = await Visitor.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$page",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get recent searches (from check-status page visits)
    const recentSearches = await Visitor.find({
      page: "/check-status",
      timestamp: { $gte: subDays(now, 7) },
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .select("timestamp ip");

    return NextResponse.json({
      stats: {
        todayVisitors,
        weekVisitors,
        monthVisitors,
        totalCases,
        casesByStatus,
      },
      charts: {
        dailyVisitors,
        topPages,
      },
      recentSearches,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}
