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
import type * as books from "../books.js";
import type * as cars from "../cars.js";
import type * as checklistTemplates from "../checklistTemplates.js";
import type * as consumption from "../consumption.js";
import type * as finances from "../finances.js";
import type * as genres from "../genres.js";
import type * as maintenanceSeed from "../maintenanceSeed.js";
import type * as parts from "../parts.js";
import type * as recipes from "../recipes.js";
import type * as serviceRecords from "../serviceRecords.js";
import type * as specs from "../specs.js";
import type * as vehicleProfiles from "../vehicleProfiles.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  books: typeof books;
  cars: typeof cars;
  checklistTemplates: typeof checklistTemplates;
  consumption: typeof consumption;
  finances: typeof finances;
  genres: typeof genres;
  maintenanceSeed: typeof maintenanceSeed;
  parts: typeof parts;
  recipes: typeof recipes;
  serviceRecords: typeof serviceRecords;
  specs: typeof specs;
  vehicleProfiles: typeof vehicleProfiles;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
