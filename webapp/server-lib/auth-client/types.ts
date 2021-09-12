/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export interface LoginResult {
  status: string;
  tokens: {
    [key: string]: Tokens;
  };
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
