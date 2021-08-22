/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import * as cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as querystring from 'query-string';

import { getConfig, getOidcClient } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const cookies: string[] = [];
  let path = '/';
  let payload: Record<string, unknown> = { method: 'not GET' };

  if (req.method === 'GET') {
    const config = getConfig();
    const { CALLBACK_URL, COOKIE, IRON_UNSEAL, IRON_OPTIONS } = config;

    const verifyCookie = req.cookies[COOKIE.VERIFY.NAME];
    if (!verifyCookie) {
      const query = querystring.stringify({ error: 'LOGIN_FAILED' });
      path = `${path}?${query}`;
      payload = { cookie: 'not found' };
    } else {
      const coverVerifier = (await Iron.unseal(
        verifyCookie,
        IRON_UNSEAL,
        IRON_OPTIONS,
      )) as string;

      const client = await getOidcClient(config);
      const params = client.callbackParams(req);
      const tokens = await client.oauthCallback(CALLBACK_URL, params, {
        code_verifier: coverVerifier,
      });
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      payload = {
        accessToken,
        params,
        refreshToken,
        test: 'value',
      };
    }
  }
  res.setHeader('set-cookie', cookies);
  // res.redirect(302, path);
  res.json(payload);
}

export default handler;
