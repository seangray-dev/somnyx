import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

// Schedule message cleanup to run every hour
crons.hourly(
  "cleanup expired messages",
  { minuteUTC: 0 }, // Run at the start of every hour
  // @ts-ignore
  internal.mutations.message.cleanupExpiredMessages
);

// Schedule dream reminders to run daily
crons.daily(
  "send dream reminders",
  { hourUTC: 14, minuteUTC: 0 }, // Run at 2:00 PM UTC
  internal.mutations.emails.sendDreamReminder
);

// Schedule monthly insights to run on the first of each month
crons.monthly(
  "send monthly insights",
  { day: 1, hourUTC: 14, minuteUTC: 0 }, // Run at 2PM UTC -> 9AM EST on the first day of each month
  internal.mutations.emails.sendMonthlyInsights
);

export default crons;
