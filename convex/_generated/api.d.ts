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
import type * as email_util from "../email/util.js";
import type * as email_welcome from "../email/welcome.js";
import type * as http from "../http.js";
import type * as mutations from "../mutations.js";
import type * as mutations_analysis from "../mutations/analysis.js";
import type * as mutations_deleteAccountFeedback from "../mutations/deleteAccountFeedback.js";
import type * as mutations_dreams from "../mutations/dreams.js";
import type * as mutations_insights from "../mutations/insights.js";
import type * as mutations_openai from "../mutations/openai.js";
import type * as mutations_users from "../mutations/users.js";
import type * as queries from "../queries.js";
import type * as queries_analysis from "../queries/analysis.js";
import type * as queries_dreams from "../queries/dreams.js";
import type * as queries_emotions from "../queries/emotions.js";
import type * as queries_insights from "../queries/insights.js";
import type * as queries_roles from "../queries/roles.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";
import type * as util from "../util.js";

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
  "email/util": typeof email_util;
  "email/welcome": typeof email_welcome;
  http: typeof http;
  "mutations/analysis": typeof mutations_analysis;
  "mutations/deleteAccountFeedback": typeof mutations_deleteAccountFeedback;
  "mutations/dreams": typeof mutations_dreams;
  "mutations/insights": typeof mutations_insights;
  "mutations/openai": typeof mutations_openai;
  "mutations/users": typeof mutations_users;
  mutations: typeof mutations;
  "queries/analysis": typeof queries_analysis;
  "queries/dreams": typeof queries_dreams;
  "queries/emotions": typeof queries_emotions;
  "queries/insights": typeof queries_insights;
  "queries/roles": typeof queries_roles;
  queries: typeof queries;
  stripe: typeof stripe;
  users: typeof users;
  util: typeof util;
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
