import * as React from "react";

import { Hr } from "@react-email/components";

import { BASE_URL } from "../util";
import BaseEmailTemplate, {
  DefaultFooter,
  EmailButton,
  EmailHeading,
  EmailSection,
  EmailText,
} from "./base-template";

interface DreamReminderEmailProps {
  name?: string;
  daysSinceLastDream: number;
}

export const getPlainText = ({
  name,
  daysSinceLastDream,
}: DreamReminderEmailProps) => {
  const timeMessage = getTimeMessage(daysSinceLastDream);

  return `Missing Your Dreams!

Hey${name ? ` ${name}` : ""}, 

It's been ${timeMessage} since you last recorded a dream. Don't let those precious dream memories fade away!

Dreams can provide valuable insights into your subconscious mind. By regularly recording your dreams, you can:
- Track patterns in your dream experiences
- Gain deeper self-understanding
- Unlock meaningful personal insights

Ready to resume your dream journey?
${BASE_URL}/dashboard

Need help getting started again?
Visit our support page: ${BASE_URL}/support

Manage email preferences:
${BASE_URL}/settings/notifications

Sweet dreams,
The Somnyx Team`;
};

const getTimeMessage = (days: number) => {
  if (days < 14) return `${days} days`;
  if (days < 60) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? "month" : "months"}`;
};

export default function DreamReminderEmail({
  name,
  daysSinceLastDream,
}: DreamReminderEmailProps) {
  const timeMessage = getTimeMessage(daysSinceLastDream);
  const previewText = `Missing your dreams! It's been ${timeMessage} since your last dream journal entry.`;

  return (
    <BaseEmailTemplate
      previewText={previewText}
      footerContent={<DefaultFooter />}
    >
      <EmailHeading>Don't Let Your Dreams Fade Away</EmailHeading>

      <EmailText className="text-center">
        Hey{name ? ` ${name}` : ""}, we've noticed you haven't recorded a dream
        in {timeMessage}. Tracking your dreams is valuable, and we don't want
        you to miss out on understanding the messages your subconscious is
        sending you.
      </EmailText>

      <div className="mt-6 flex justify-center">
        <EmailButton href={`${BASE_URL}/dashboard`}>
          Capture Your Dreams Now →
        </EmailButton>
      </div>

      <Hr className="my-[32px] border border-solid border-[#eaeaea]" />

      <EmailSection>
        <EmailText>
          Dreams can provide valuable insights into your subconscious mind. By
          regularly recording your dreams, you can:
        </EmailText>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>Track patterns in your dream experiences</li>
          <li>Gain deeper self-understanding</li>
          <li>Unlock meaningful personal insights</li>
        </ul>
      </EmailSection>
      <Hr className="my-[32px] border border-solid border-[#eaeaea]" />
    </BaseEmailTemplate>
  );
}
