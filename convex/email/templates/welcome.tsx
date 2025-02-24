import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { BASE_URL } from "../util";

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
  const previewText = `Welcome to Somnyx - Unlock Your Dream's Meaning`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="mx-auto my-auto bg-[#fafafa] px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] overflow-hidden rounded-lg border border-solid border-[#eaeaea] bg-white shadow-sm">
            <Section className="mt-[32px] p-[20px]">
              <Img
                src={`${BASE_URL}/images/logo.png`}
                width="180"
                height="auto"
                alt="Somnyx logo"
                className="mx-auto my-0"
              />
            </Section>

            <Section className="px-[20px]">
              <Heading className="text-center font-serif text-xl font-normal tracking-tight">
                Never Let Another Dream Slip Away
              </Heading>

              <Text className="text-[15px] leading-[24px] text-gray-600">
                {name ? `Hey ${name},` : "Hey,"} thanks for joining Somnyx!
                Every dream holds a story waiting to be understood. With Somnyx,
                you're now equipped to unlock the meanings behind your dreams
                and gain valuable insights into your subconscious mind.
              </Text>

              <div className="text-center">
                <Button
                  className="inline-block rounded bg-black px-6 py-3 text-center text-xs font-semibold text-white no-underline"
                  href={`${BASE_URL}/install-guide`}
                >
                  Install Somnyx App →
                </Button>
              </div>
            </Section>

            <Hr className="my-[32px] border border-solid border-[#eaeaea]" />

            <Section className="px-[20px]">
              <Text className="mb-6 text-center text-sm font-medium text-black">
                Your path to deeper dream understanding:
              </Text>

              <div className="bg-gray-50 p-4">
                <div>
                  <Link
                    href={`${BASE_URL}/dashboard`}
                    className="text-blue-600 no-underline hover:text-blue-800"
                  >
                    <strong>✍️ Free Dream Journal</strong>
                  </Link>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Record and track your dreams securely
                  </Text>
                </div>

                <br />

                <div>
                  <Link
                    href={`${BASE_URL}/dashboard`}
                    className="text-blue-600 no-underline hover:text-blue-800"
                  >
                    <strong>🤖 AI Dream Interpretation</strong>
                  </Link>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Get personalized insights using advanced AI analysis
                  </Text>
                </div>

                <br />

                <div>
                  <Link
                    href={`${BASE_URL}/dreamscape`}
                    className="text-blue-600 no-underline hover:text-blue-800"
                  >
                    <strong>🌌 Dreamscape</strong>
                  </Link>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Share and explore dreams from our community
                  </Text>
                </div>

                <br />

                <div>
                  <Link
                    href={`${BASE_URL}/dream-dictionary`}
                    className="text-blue-600 no-underline hover:text-blue-800"
                  >
                    <strong>📚 Dream Dictionary</strong>
                  </Link>
                  <Text className="m-0 text-[14px] text-gray-600">
                    Explore common dream themes/symbols and their meanings
                  </Text>
                </div>
              </div>
            </Section>

            <Section className="mt-8 px-4 py-6">
              <Text className="m-0 text-center text-[14px] text-gray-600">
                🌟 <strong>Pro Tip:</strong> Install our app for the best
                experience
                <br />
                <Link
                  href={`${BASE_URL}/install-guide`}
                  className="ml-1 text-blue-600 no-underline hover:text-blue-800"
                >
                  See installation guide →
                </Link>
              </Text>
            </Section>

            <Hr className="my-[32px] border border-solid border-[#eaeaea]" />

            <Section className="bg-white px-[20px] pb-6">
              <Text className="m-0 text-center text-[14px] text-gray-600">
                Sweet dreams,
                <br />
                The Somnyx Team
              </Text>

              <Text className="mt-6 text-center text-[12px] text-gray-500">
                Need help?{" "}
                <Link
                  href={`${BASE_URL}/support`}
                  className="text-blue-600 no-underline hover:text-blue-800"
                >
                  Visit support
                </Link>{" "}
                or{" "}
                <Link
                  href={`${BASE_URL}/contact`}
                  className="text-blue-600 no-underline hover:text-blue-800"
                >
                  contact us
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
