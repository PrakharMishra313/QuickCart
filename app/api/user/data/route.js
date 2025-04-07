import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/user";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      console.log("❌ No userId found in auth.");
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    console.log("🔐 Clerk userId:", userId);

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ No user found in MongoDB for ID:", userId);
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    console.log("✅ User found:", user);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error in /api/user/data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}