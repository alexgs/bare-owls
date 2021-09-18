/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { server } from './auth-server';

export async function logout(
  refreshToken: string,
  global?: boolean,
): Promise<string> {
  global = global ?? false;
  const response = await server.post('api/logout', {
    headers: {
      Authorization: undefined,
    },
    searchParams: {
      global,
      refreshToken,
    },
  });
  if (response.statusCode === 200) {
    return 'ok';
  }
  return 'error';
}
