import { NextResponse } from "next/server";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { source, sessionId } = await request.json();
    if (!source || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user's public metadata in Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        signUpSource: source,
        dreamInterpreterSessionId: sessionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Analytics Route Error]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
