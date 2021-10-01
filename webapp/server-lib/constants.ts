/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export const COOKIE_HEADER = 'Set-Cookie';

// Standardize and sanitize response codes (e.g. auth failures return the general 400 code)
export const HTTP_CODE = {
  BAD_REQUEST: 400,
  FORBIDDEN: 400,
  NOT_FOUND: 404,
  REDIRECT: 307,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 400,
} as const;

// Status messages for internal or private API calls; see /webapp/lib/constants for public status messages
export const PRIVATE = {
  ERROR: {
    ACCESS_TOKEN: {
      // HTTP error from the auth server when attempting to exchange a refresh token for a new access token.
      EXCHANGE_REFRESH_ERROR: 'status.internal-api.error.unable-to-exchange-refresh-token',
      // JWT failed validation, either locally or with the auth server.
      INVALID_JWT: 'status.internal-api.error.invalid-jwt',
      // No refresh token was found in the request's cookies.
      NO_REFRESH_TOKEN: 'status.internal-api.error.no-refresh-token-in-cookies',
      // Did not receive the new access and refresh tokens from the auth server.
      NOT_RECEIVED: 'status.internal-api.error.new-tokens-not-received',
    },
    AUTH_LINK: {
      CREATE_USER: 'status.internal-api.error.unable-to-create-user',
      REGISTER_USER: 'status.internal-api.error.unable-to-register-user',
    },
    UNKNOWN: 'status.internal-api.error.unknown',
  },
  OK: 'status.internal-api.ok',
} as const;
// ^^^^^^^ This `as const` cast is critical to defining literal types within an
//   object like this (see ["Literal Inference"][1] in the Typescript docs).
// [1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-inference
