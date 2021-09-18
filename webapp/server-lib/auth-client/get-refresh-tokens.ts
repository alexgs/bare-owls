/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { server } from './auth-server';
import { RefreshTokenData, RefreshTokenResult } from './types';

// See https://fusionauth.io/docs/v1/tech/apis/jwt/#retrieve-refresh-tokens
interface DangerousRefreshTokenData extends RefreshTokenData {
  token: string;
}

interface ResponseBody {
  refreshTokens: DangerousRefreshTokenData[];
}

export async function getRefreshTokens(
  accessToken: string,
): Promise<RefreshTokenResult> {
  const response = await server.get<ResponseBody>('api/jwt/refresh', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.statusCode === 200) {
    const safeTokens = response.body.refreshTokens.map((dangerousToken) => {
      const safe = {
        ...dangerousToken,
        token: undefined,
      };
      delete safe.token;
      return safe;
    });
    return {
      status: 'ok',
      tokens: safeTokens,
    };
  } else {
    return {
      status: 'error',
      tokens: [],
    };
  }
}
