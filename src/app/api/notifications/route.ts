import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { sendNotificationToUser } from "@/features/notifications/api/notification-service";

export async function POST(request: Request) {
  try {
    const { userId, type, data } = await request.json();
    const { getToken } = auth();
    const token = await getToken({ template: "convex" });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendNotificationToUser(userId, type, token, data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
