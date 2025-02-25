import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { BASE_URL } from "../util";

interface BaseEmailTemplateProps {
  previewText: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function BaseEmailTemplate({
  previewText,
  children,
  footerContent,
}: BaseEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#fafafa] px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] overflow-hidden rounded-lg border border-solid border-[#eaeaea] bg-white shadow-sm">
            {/* Logo Section */}
            <Section className="my-[32px] px-[20px]">
              <Img
                src={`${BASE_URL}/images/logo.png`}
                width="180"
                height="auto"
                alt="Somnyx logo"
                className="mx-auto my-0"
              />
            </Section>

            {/* Main Content */}
            <Section className="px-[20px]">{children}</Section>

            {/* Footer */}
            {footerContent && (
              <Section className="bg-white px-[20px] pb-6">
                {footerContent}
              </Section>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// Helper components for consistent styling across emails
export const EmailButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="inline-block rounded bg-black px-6 py-3 text-center text-xs font-semibold text-white no-underline"
  >
    {children}
  </a>
);

export const EmailLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a href={href} className="text-blue-600 no-underline hover:text-blue-800">
    {children}
  </a>
);

export const EmailSection = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={`mb-6 ${className}`}>{children}</div>;

export const EmailHeading = ({ children }: { children: React.ReactNode }) => (
  <Heading className="m-0 text-center font-serif text-2xl font-normal tracking-tight">
    {children}
  </Heading>
);

export const EmailText = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <Text className={`text-sm leading-[24px] text-gray-600 ${className}`}>
    {children}
  </Text>
);

export const DefaultFooter = () => (
  <Section className="text-center">
    <EmailText className="m-0">
      Sweet dreams,
      <br />
      The Somnyx Team
    </EmailText>

    <EmailText className="mt-4 text-xs text-gray-500">
      Need help?{" "}
      <EmailLink href={`${BASE_URL}/support`}>Visit support</EmailLink> or{" "}
      <EmailLink href={`${BASE_URL}/contact`}>contact us</EmailLink>
      <br />
      <EmailLink href={`${BASE_URL}/settings`}>
        Manage email preferences
      </EmailLink>
    </EmailText>
  </Section>
);
