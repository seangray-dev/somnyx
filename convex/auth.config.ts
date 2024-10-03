/* eslint-disable n/no-process-env */
const envDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

const config = {
  providers: [
    {
      domain: envDomain,
      applicationID: "convex",
    },
  ],
};

export default config;
