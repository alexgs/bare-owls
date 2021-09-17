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

export type TokenContext =
  | typeof TOKEN_CONTEXT.OPEN
  | typeof TOKEN_CONTEXT.SECURE;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
