/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { getRefreshTokens } from './get-refresh-tokens';
import { login } from './login';
import { logout } from './logout';
import { LoginResult } from './types';

export type { RefreshTokenData } from './types';

export type AuthClient = Readonly<{
  getRefreshTokens: typeof getRefreshTokens; // TODO Change this to a final form
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: typeof logout; // TODO Change this to a final form
}>;

export const auth: AuthClient = {
  getRefreshTokens,
  login,
  logout,
};
