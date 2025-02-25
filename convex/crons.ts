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

export default crons;
