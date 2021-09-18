/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Response } from 'got';

import { getConfig } from '../';

import { server } from './auth-server';
import { LoginResult, Tokens } from './types';

interface RequestPayload {
  applicationId: string;
  password: string;
  loginId: string;
}

interface ResponseBody {
  refreshToken: string;
  token: string;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResult> {
  const { AUTH_APP_IDS } = getConfig();
  const responses = await Promise.all(
    // TODO Change this to use WEBAPP_CORE_API_ID and WEBAPP_CDN_APP_ID
    AUTH_APP_IDS.map(async (applicationId): Promise<Response<ResponseBody>> => {
      return server.post<ResponseBody>('api/login', {
        json: {
          applicationId,
          password,
          loginId: username,
        },
      });
    }),
  );

  return responses.reduce(
    (output, response) => {
      if (response.statusCode === 200) {
        output.status = 'ok';
        const { applicationId } = response.request.options.json as RequestPayload;
        output.tokens[applicationId] = {
          accessToken: response.body.token,
          refreshToken: response.body.refreshToken,
        };
      } else {
        output.status = 'error';
      }

      return output;
    },
    {
      status: '',
      tokens: {} as { [key: string]: Tokens },
    },
  );
}
