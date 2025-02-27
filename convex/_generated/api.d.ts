/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clerk from "../clerk.js";
import type * as crons from "../crons.js";
import type * as email_resend from "../email/resend.js";
import type * as email_templates_baseTemplate from "../email/templates/baseTemplate.js";
import type * as email_templates_dreamReminder from "../email/templates/dreamReminder.js";
import type * as email_templates_monthlyInsights from "../email/templates/monthlyInsights.js";
import type * as email_templates_monthlyInsights_example from "../email/templates/monthlyInsights_example.js";
import type * as email_templates_welcome from "../email/templates/welcome.js";
import type * as email_util from "../email/util.js";
import type * as emails from "../emails.js";
import type * as http from "../http.js";
import type * as mutations_analysis from "../mutations/analysis.js";
import type * as mutations_commonElements from "../mutations/commonElements.js";
import type * as mutations_deleteAccountFeedback from "../mutations/deleteAccountFeedback.js";
import type * as mutations_dreams from "../mutations/dreams.js";
import type * as mutations_emails from "../mutations/emails.js";
import type * as mutations_feedback from "../mutations/feedback.js";
import type * as mutations_insights from "../mutations/insights.js";
import type * as mutations_interpretations from "../mutations/interpretations.js";
import type * as mutations_message from "../mutations/message.js";
import type * as mutations_notificationPreferences from "../mutations/notificationPreferences.js";
import type * as mutations_notifications from "../mutations/notifications.js";
import type * as mutations_openai from "../mutations/openai.js";
import type * as mutations_rateLimit from "../mutations/rateLimit.js";
import type * as mutations_themePages from "../mutations/themePages.js";
import type * as mutations_users from "../mutations/users.js";
import type * as mutations from "../mutations.js";
import type * as queries_analysis from "../queries/analysis.js";
import type * as queries_commonElements from "../queries/commonElements.js";
import type * as queries_dreams from "../queries/dreams.js";
import type * as queries_emails from "../queries/emails.js";
import type * as queries_emotions from "../queries/emotions.js";
import type * as queries_insights from "../queries/insights.js";
import type * as queries_interpretations from "../queries/interpretations.js";
import type * as queries_message from "../queries/message.js";
import type * as queries_notificationPreferences from "../queries/notificationPreferences.js";
import type * as queries_notifications from "../queries/notifications.js";
import type * as queries_roles from "../queries/roles.js";
import type * as queries_scheduler from "../queries/scheduler.js";
import type * as queries_themePages from "../queries/themePages.js";
import type * as queries from "../queries.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";
import type * as util from "../util.js";
import type * as zodSchemas from "../zodSchemas.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clerk: typeof clerk;
  crons: typeof crons;
  "email/resend": typeof email_resend;
  "email/templates/baseTemplate": typeof email_templates_baseTemplate;
  "email/templates/dreamReminder": typeof email_templates_dreamReminder;
  "email/templates/monthlyInsights": typeof email_templates_monthlyInsights;
  "email/templates/monthlyInsights_example": typeof email_templates_monthlyInsights_example;
  "email/templates/welcome": typeof email_templates_welcome;
  "email/util": typeof email_util;
  emails: typeof emails;
  http: typeof http;
  "mutations/analysis": typeof mutations_analysis;
  "mutations/commonElements": typeof mutations_commonElements;
  "mutations/deleteAccountFeedback": typeof mutations_deleteAccountFeedback;
  "mutations/dreams": typeof mutations_dreams;
  "mutations/emails": typeof mutations_emails;
  "mutations/feedback": typeof mutations_feedback;
  "mutations/insights": typeof mutations_insights;
  "mutations/interpretations": typeof mutations_interpretations;
  "mutations/message": typeof mutations_message;
  "mutations/notificationPreferences": typeof mutations_notificationPreferences;
  "mutations/notifications": typeof mutations_notifications;
  "mutations/openai": typeof mutations_openai;
  "mutations/rateLimit": typeof mutations_rateLimit;
  "mutations/themePages": typeof mutations_themePages;
  "mutations/users": typeof mutations_users;
  mutations: typeof mutations;
  "queries/analysis": typeof queries_analysis;
  "queries/commonElements": typeof queries_commonElements;
  "queries/dreams": typeof queries_dreams;
  "queries/emails": typeof queries_emails;
  "queries/emotions": typeof queries_emotions;
  "queries/insights": typeof queries_insights;
  "queries/interpretations": typeof queries_interpretations;
  "queries/message": typeof queries_message;
  "queries/notificationPreferences": typeof queries_notificationPreferences;
  "queries/notifications": typeof queries_notifications;
  "queries/roles": typeof queries_roles;
  "queries/scheduler": typeof queries_scheduler;
  "queries/themePages": typeof queries_themePages;
  queries: typeof queries;
  stripe: typeof stripe;
  users: typeof users;
  util: typeof util;
  zodSchemas: typeof zodSchemas;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
