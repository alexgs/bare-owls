/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

/**
 * Matches a JSON object. From https://github.com/sindresorhus/type-fest/
 */
export type JsonObject = { [Key in string]?: JsonValue }

/**
 * Matches a JSON array. From https://github.com/sindresorhus/type-fest/
 */
// export interface JsonArray extends Array<JsonValue> {} // Typescript < 4.1
export type JsonArray = JsonValue[] // Typescript >= 4.1

/**
 * Matches any valid JSON value. From https://github.com/sindresorhus/type-fest/
 */
export type JsonValue =
  string
  | number
  | boolean
  | null
  | JsonArray
  | JsonObject
