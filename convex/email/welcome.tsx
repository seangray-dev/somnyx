import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { BASE_URL } from "./util";

export function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to YOUR COMPANY!</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
              <Section className="mt-[32px]">
                <Img
                  src={`${BASE_URL}/logo.png`}
                  width="160"
                  height="48"
                  alt="YOUR COMPANY"
                  className="mx-auto my-0"
                />
              </Section>

              <Section className="mb-[32px] mt-[32px] text-center">
                <Text className="font-base text-[14px] leading-[24px] text-black">
                  Thanks for signing up for YOUR COMPANY.
                </Text>
              </Section>

              <Section className="mb-[16px] mt-[16px]">
                <Text className="font-base text-left text-black">
                  Feel free to send us an email at{" "}
                  <Link
                    href="mailto:_____"
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    YOUR EMAIL
                  </Link>{" "}
                  if you have any questions or have issues with your account.
                </Text>
              </Section>
              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
              <Text className="flex items-center justify-center text-[12px] leading-[24px] text-[#666666]">
                © 2024 YOUR COMPANY. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
