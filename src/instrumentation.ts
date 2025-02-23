import * as Sentry from "@sentry/nextjs";

export async function register() {
  // eslint-disable-next-line n/no-process-env
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  // eslint-disable-next-line n/no-process-env
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
