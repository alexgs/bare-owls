/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { login } from './login';
import { LoginResult } from './types';

export type AuthClient = Readonly<{
  login: (username: string, password: string) => Promise<LoginResult>;
}>;

export const auth: AuthClient = {
  login,
};
