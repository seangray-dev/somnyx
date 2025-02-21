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
import type * as email_util from "../email/util.js";
import type * as email_welcome from "../email/welcome.js";
import type * as http from "../http.js";
import type * as mutations_analysis from "../mutations/analysis.js";
import type * as mutations_commonElements from "../mutations/commonElements.js";
import type * as mutations_deleteAccountFeedback from "../mutations/deleteAccountFeedback.js";
import type * as mutations_dreams from "../mutations/dreams.js";
import type * as mutations_feedback from "../mutations/feedback.js";
import type * as mutations_insights from "../mutations/insights.js";
import type * as mutations_message from "../mutations/message.js";
import type * as mutations_notifications from "../mutations/notifications.js";
import type * as mutations_openai from "../mutations/openai.js";
import type * as mutations_themePages from "../mutations/themePages.js";
import type * as mutations_users from "../mutations/users.js";
import type * as mutations from "../mutations.js";
import type * as notifications_types_index from "../notifications/types/index.js";
import type * as queries_analysis from "../queries/analysis.js";
import type * as queries_commonElements from "../queries/commonElements.js";
import type * as queries_dreams from "../queries/dreams.js";
import type * as queries_emotions from "../queries/emotions.js";
import type * as queries_insights from "../queries/insights.js";
import type * as queries_message from "../queries/message.js";
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
  "email/util": typeof email_util;
  "email/welcome": typeof email_welcome;
  http: typeof http;
  "mutations/analysis": typeof mutations_analysis;
  "mutations/commonElements": typeof mutations_commonElements;
  "mutations/deleteAccountFeedback": typeof mutations_deleteAccountFeedback;
  "mutations/dreams": typeof mutations_dreams;
  "mutations/feedback": typeof mutations_feedback;
  "mutations/insights": typeof mutations_insights;
  "mutations/message": typeof mutations_message;
  "mutations/notifications": typeof mutations_notifications;
  "mutations/openai": typeof mutations_openai;
  "mutations/themePages": typeof mutations_themePages;
  "mutations/users": typeof mutations_users;
  mutations: typeof mutations;
  "notifications/types/index": typeof notifications_types_index;
  "queries/analysis": typeof queries_analysis;
  "queries/commonElements": typeof queries_commonElements;
  "queries/dreams": typeof queries_dreams;
  "queries/emotions": typeof queries_emotions;
  "queries/insights": typeof queries_insights;
  "queries/message": typeof queries_message;
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
