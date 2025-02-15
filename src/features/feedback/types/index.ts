export type FeedbackType = "feedback" | "issue";

export type FeedbackStatus = "new" | "in_progress" | "resolved" | "closed";

export type FeedbackPriority = "low" | "medium" | "high";

export interface FeedbackMetadata {
  browser: string;
  os: string;
  url: string;
}

export interface Feedback {
  type: FeedbackType;
  userId?: string;
  title: string;
  description: string;
  category?: string;
  status: FeedbackStatus;
  priority?: FeedbackPriority;
  metadata?: FeedbackMetadata;
  createdAt: number;
  updatedAt: number;
}
