import { headers } from "next/headers";
import { NextResponse } from "next/server";

function isValidIP(ip: string) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export async function GET() {
  console.log("[IP Endpoint] Received request");
  const headersList = headers();

  // Try headers in order of reliability
  const possibleHeaders = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip", // Nginx
    "x-forwarded-for", // Standard proxy header
    "x-client-ip", // Apache/Nginx
    "forwarded", // Standard but less common
  ];

  console.log("[IP Endpoint] Headers:", {
    allHeaders: Object.fromEntries(headersList.entries()),
  });

  let detectedIP = "127.0.0.1";

  for (const header of possibleHeaders) {
    const value = headersList.get(header);
    if (value) {
      // For x-forwarded-for, take the first IP in the list
      const ip =
        header === "x-forwarded-for"
          ? value.split(",")[0].trim()
          : value.trim();

      if (
        isValidIP(ip) &&
        ip !== "127.0.0.1" &&
        !ip.startsWith("192.168.") &&
        !ip.startsWith("10.")
      ) {
        detectedIP = ip;
        console.log(`[IP Endpoint] Found IP in ${header}:`, ip);
        break;
      }
    }
  }

  console.log("[IP Endpoint] Responding with IP:", detectedIP);

  return NextResponse.json({
    ip: detectedIP,
    source: process.env.VERCEL ? "vercel" : "local",
  });
}
