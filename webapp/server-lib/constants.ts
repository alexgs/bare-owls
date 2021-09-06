/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export const COOKIE_HEADER = 'Set-Cookie';
export const STATUS = {
  OK: 'status.ok',
  ERROR: {
    ACCESS_TOKEN: {
      EXCHANGE_REFRESH_ERROR: 'status.error.unable-to-exchange-refresh-token', // HTTP error from the auth server when attempting to exchange a refresh token for a new access token
      INVALID_JWT: 'status.error.invalid-jwt', // JWT failed validation, either locally and with the auth server
      NOT_RECEIVED: 'status.error.new-tokens-not-received', // Did not receive the new access and refresh tokens from the auth server
      NO_REFRESH_TOKEN: 'status.error.no-refresh-token-in-cookies', // No refresh token was found in the request's cookies
    },
    UNKNOWN: 'status.error.unknown',
  },
} as const;
// ^^^^^^^ This `as const` cast is critical to defining literal types within an
//   object like this (see ["Literal Inference"][1] in the Typescript docs).
// [1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-inference
