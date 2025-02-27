import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  function getClientIP(): string {
    const FALLBACK_IP_ADDRESS = "0.0.0.0";
    const headersList = headers();

    // Check headers in order of reliability
    const ipAddress =
      headersList.get("cf-connecting-ip") ?? // Cloudflare
      headersList.get("x-real-ip") ?? // Nginx
      headersList.get("x-forwarded-for")?.split(",")[0] ?? // Standard proxy
      headersList.get("x-client-ip") ?? // Apache
      headersList.get("x-forwarded") ?? // Generic forward
      headersList.get("forwarded-for") ?? // Generic forward
      headersList.get("remote-addr") ?? // Direct connection
      FALLBACK_IP_ADDRESS;

    return ipAddress.trim();
  }

  return NextResponse.json({
    ip: getClientIP(),
  });
}
