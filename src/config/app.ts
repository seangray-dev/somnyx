export const appplicationName = "somnyx";
export const baseUrl = "https://somnyx.vercel.app";

export const DOMAIN =
  process.env.NODE_ENV === "production" ? baseUrl : "https://localhost:3000";
