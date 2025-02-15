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

export default crons;
