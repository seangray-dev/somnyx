import * as React from "react";

import { Hr, Text } from "@react-email/components";

import { BASE_URL } from "../util";
import BaseEmailTemplate, {
  DefaultFooter,
  EmailButton,
  EmailHeading,
  EmailLink,
  EmailSection,
  EmailText,
} from "./base-template";

interface WelcomeEmailProps {
  name?: string;
}

export const getPlainText = (name?: string) => `Welcome to Somnyx!

Hey${name ? ` ${name}` : ""}, thanks for joining Somnyx! 

Every dream holds a story waiting to be understood. With Somnyx, you're now equipped to unlock the meanings behind your dreams and gain valuable insights into your subconscious mind.

Your path to deeper dream understanding:

✍️ Free Dream Journal
Record and track your dreams securely
${BASE_URL}/dashboard

🤖 AI Dream Interpretation
Get personalized insights using advanced AI analysis
${BASE_URL}/dashboard

🌌 Dreamscape
Share and explore dreams from our community
${BASE_URL}/dreamscape

📚 Dream Dictionary
Explore common dream symbols and their meanings
${BASE_URL}/dream-dictionary

⭐ Pro Tip: Install our app for the best experience
Installation guide: ${BASE_URL}/install-guide

Sweet dreams,
The Somnyx Team

Need help? Visit support (${BASE_URL}/support) or contact us (${BASE_URL}/contact)`;

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="Welcome to Somnyx - Unlock Your Dream's Meaning"
      footerContent={<DefaultFooter />}
    >
      <EmailHeading>Never Let Another Dream Slip Away</EmailHeading>

      <EmailText>
        {name ? `Hey ${name},` : "Hey,"} thanks for joining Somnyx! Every dream
        holds a story waiting to be understood. With Somnyx, you're now equipped
        to unlock the meanings behind your dreams and gain valuable insights
        into your subconscious mind.
      </EmailText>

      <div className="text-center">
        <EmailButton href={`${BASE_URL}/install-guide`}>
          Install Somnyx App →
        </EmailButton>
      </div>

      <Hr className="my-[32px] border border-solid border-[#eaeaea]" />

      <EmailText className="mb-6 text-center font-medium text-black">
        Your path to deeper dream understanding:
      </EmailText>

      <div className="bg-gray-50 p-4">
        <EmailSection>
          <EmailLink href={`${BASE_URL}/dashboard`}>
            <strong>✍️ Free Dream Journal</strong>
          </EmailLink>
          <EmailText className="m-0">
            Record and track your dreams securely
          </EmailText>
        </EmailSection>

        <EmailSection>
          <EmailLink href={`${BASE_URL}/dashboard`}>
            <strong>🤖 AI Dream Interpretation</strong>
          </EmailLink>
          <EmailText className="m-0">
            Get personalized insights using advanced AI analysis
          </EmailText>
        </EmailSection>

        <EmailSection>
          <EmailLink href={`${BASE_URL}/dreamscape`}>
            <strong>🌌 Dreamscape</strong>
          </EmailLink>
          <EmailText className="m-0">
            Share and explore dreams from our community
          </EmailText>
        </EmailSection>

        <EmailSection>
          <EmailLink href={`${BASE_URL}/dream-dictionary`}>
            <strong>📚 Dream Dictionary</strong>
          </EmailLink>
          <EmailText className="m-0">
            Explore common dream themes/symbols and their meanings
          </EmailText>
        </EmailSection>
      </div>

      <EmailSection className="mt-8">
        <Text className="mt-6 text-center">
          🌟 <strong>Pro Tip:</strong> Install our app for the best experience
          <br />
          <EmailLink href={`${BASE_URL}/install-guide`}>
            See installation guide →
          </EmailLink>
        </Text>
      </EmailSection>

      <Hr className="my-[32px] border border-solid border-[#eaeaea]" />
    </BaseEmailTemplate>
  );
}
