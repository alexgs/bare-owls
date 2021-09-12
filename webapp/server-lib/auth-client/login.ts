/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { server } from './auth-server';
import { LoginResult } from './types';

export async function login(
  username: string,
  password: string,
): Promise<LoginResult> {
  const response = await server.post('/api/login');
  return {
    status: '?',
    tokens: {
      fake: {
        accessToken: 'fake',
        refreshToken: 'fake',
      },
    },
  };
}
