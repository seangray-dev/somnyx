import { ConvexError } from "convex/values";

import { resend } from "./email/resend";
import DreamReminderEmail, {
  getPlainText as getDreamReminderPlainText,
} from "./email/templates/dreamReminder";
import MonthlyInsightsEmail, {
  getPlainText as getMonthlyInsightsPlainText,
} from "./email/templates/monthlyInsights";
import WelcomeEmail, {
  getPlainText as getWelcomePlainText,
} from "./email/templates/welcome";

export const sendWelcomeEmail = async ({
  email,
  name,
}: {
  email: string;
  name?: string;
}) => {
  const { error } = await resend.emails.send({
    from: "Somnyx <onboarding@somnyx.app>",
    to: email,
    subject: "Thanks for joining!",
    react: WelcomeEmail({ name }),
    text: getWelcomePlainText(name),
  });

  if (error) {
    console.error(error);
    throw new ConvexError({ message: error.message });
  }
};

export const sendDreamReminderEmail = async ({
  email,
  name,
  daysSinceLastDream,
}: {
  email: string;
  name?: string;
  daysSinceLastDream: number;
}) => {
  const { error } = await resend.emails.send({
    from: "Somnyx <notifications@somnyx.app>",
    to: email,
    subject: "Don't Forget To Log Your Dreams!",
    react: DreamReminderEmail({ name, daysSinceLastDream }),
    text: getDreamReminderPlainText({ name, daysSinceLastDream }),
  });

  if (error) {
    console.error(error);
    throw new ConvexError({ message: error.message });
  }
};

export const sendMonthlyInsightsEmail = async ({
  email,
  name,
  month,
  monthNumber,
  year,
  stats,
}: {
  email: string;
  name?: string;
  month: string;
  monthNumber: string;
  year: number;
  stats: {
    totalDreams: number;
    streakDays: number;
  };
}) => {
  const { error } = await resend.emails.send({
    from: "Somnyx <notifications@somnyx.app>",
    to: email,
    subject: `Your ${month} ${year} Dream Insights Are Ready!`,
    react: MonthlyInsightsEmail({ name, month, monthNumber, year, stats }),
    text: getMonthlyInsightsPlainText({
      name,
      month,
      monthNumber,
      year,
      stats,
    }),
  });

  if (error) {
    console.error(error);
    throw new ConvexError({ message: error.message });
  }
};
