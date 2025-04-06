import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/user";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error("GET /api/user/data error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
