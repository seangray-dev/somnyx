import { ConvexError } from "convex/values";

import { resend } from "./email/resend";
import WelcomeEmail, { getPlainText } from "./email/templates/welcome";

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
    text: getPlainText(name),
  });

  if (error) {
    console.error(error);
    throw new ConvexError({ message: error.message });
  }
};
