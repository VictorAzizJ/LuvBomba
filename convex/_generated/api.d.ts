/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cleanup from "../cleanup.js";
import type * as crons from "../crons.js";
import type * as delivery from "../delivery.js";
import type * as deliveryActions from "../deliveryActions.js";
import type * as http from "../http.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_privacy from "../lib/privacy.js";
import type * as lib_validation from "../lib/validation.js";
import type * as messages from "../messages.js";
import type * as optOut from "../optOut.js";
import type * as payments from "../payments.js";
import type * as paymentsActions from "../paymentsActions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  cleanup: typeof cleanup;
  crons: typeof crons;
  delivery: typeof delivery;
  deliveryActions: typeof deliveryActions;
  http: typeof http;
  "lib/constants": typeof lib_constants;
  "lib/privacy": typeof lib_privacy;
  "lib/validation": typeof lib_validation;
  messages: typeof messages;
  optOut: typeof optOut;
  payments: typeof payments;
  paymentsActions: typeof paymentsActions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
