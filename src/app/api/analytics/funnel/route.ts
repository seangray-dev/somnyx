import { NextResponse } from "next/server";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";
import { PostHog } from "posthog-node";

// Initialize PostHog
const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: "https://us.posthog.com",
});

export async function POST(request: Request) {
  try {
    console.log("[Funnel API] Request received");

    const { userId } = auth();
    if (!userId) {
      console.log("[Funnel API] No userId found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { source, sessionId } = await request.json();
    console.log("[Funnel API] Params", { userId, source, sessionId });

    if (!source || !sessionId) {
      console.log("[Funnel API] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      console.log("[Funnel API] User not found in Clerk");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[Funnel API] Sending to PostHog", {
      distinctId: userId,
      email: user.emailAddresses[0]?.emailAddress,
    });

    // Track signup completion with funnel data
    posthogClient.capture({
      distinctId: userId,
      event: "[AUTH] - SIGNUP COMPLETED",
      properties: {
        email: user.emailAddresses[0]?.emailAddress,
        signUpSource: source,
        dreamInterpreterSessionId: sessionId,
        source: "dream-interpreter-funnel",
        timestamp: new Date().toISOString(),
        clerk_user_id: userId,
        has_email_verified:
          user.emailAddresses[0]?.verification?.status === "verified",
      },
    });

    // Ensure the event is sent
    await posthogClient.shutdown();
    console.log("[Funnel API] PostHog event sent and client shutdown");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Funnel API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
