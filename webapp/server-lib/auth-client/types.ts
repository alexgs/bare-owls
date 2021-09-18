/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { TOKEN_CONTEXT } from 'server-lib';

export interface LoginResult {
  status: string;
  tokens: {
    [key: string]: Tokens;
  };
}

// See https://fusionauth.io/docs/v1/tech/apis/jwt/#retrieve-refresh-tokens
export interface RefreshTokenData {
  applicationId: string;
  id: string;
  insertInstant: number;
  metaData: {
    device: {
      description?: string;
      lastAccessedAddress?: string;
      lastAccessedInstant: number;
      name?: string;
      type: string;
    };
    scopes?: string[];
  };
  startInstant: number;
  userId: string;
}

export interface RefreshTokenResult {
  status: string;
  tokens: RefreshTokenData[];
}

export type TokenContext =
  | typeof TOKEN_CONTEXT.OPEN
  | typeof TOKEN_CONTEXT.SECURE;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
