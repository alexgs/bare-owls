/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { server } from './auth-server';

// See https://fusionauth.io/docs/v1/tech/apis/jwt/#retrieve-refresh-tokens
interface DangerousRefreshTokenData extends RefreshTokenData {
  token: string;
}

// See https://fusionauth.io/docs/v1/tech/apis/jwt/#retrieve-refresh-tokens
interface RefreshTokenData {
  applicationId: string;
  id: string;
  insertInstant: number;
  metadata: {
    device: {
      description?: string;
      lastAccessedAddress?: string;
      lastAccessedInstant: number;
      name?: string;
      type: string;
    }
    scopes?: string[];
  },
  userId: string;
}

interface ResponseBody {
  refreshTokens: DangerousRefreshTokenData[];
}

export async function getRefreshTokens(accessToken: string): Promise<DangerousRefreshTokenData[]> {
  const response = await server.get<ResponseBody>('api/jwt/refresh', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // const output = {
  //   body: response.body,
  //   request: {
  //     headers: response.request.options.headers,
  //   },
  //   statusCode: response.statusCode,
  //   statusMessage: response.statusMessage,
  // }
  // console.log('>--+--<\n' + JSON.stringify(output) + '\n>--+--<');
  return response.body.refreshTokens;
}
