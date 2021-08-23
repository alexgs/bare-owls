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
  const config = getConfig();
  const { CALLBACK_URL, COOKIE, IRON_UNSEAL, IRON_OPTIONS } = config;

  const verifierCookie = cookie.serialize(
    COOKIE.VERIFY.NAME,
    '',
    COOKIE.VERIFY.RM,
  );
  const cookies = [verifierCookie];
  let path = '/';

  if (req.method === 'GET') {
    const verifyCookie = req.cookies[COOKIE.VERIFY.NAME];
    if (!verifyCookie) {
      const query = querystring.stringify({ error: 'LOGIN_FAILED' });
      path = `${path}?${query}`;
    } else {
      const codeVerifier = (await Iron.unseal(
        verifyCookie,
        IRON_UNSEAL,
        IRON_OPTIONS,
      )) as string;

      const client = await getOidcClient(config);
      const params = client.callbackParams(req);
      const tokens = await client.oauthCallback(CALLBACK_URL, params, {
        code_verifier: codeVerifier,
      });
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;

      if (accessToken && refreshToken) {
        const accessTokenCookie = cookie.serialize(
          COOKIE.ACCESS_TOKEN.NAME,
          accessToken,
          COOKIE.ACCESS_TOKEN.SET,
        );
        cookies.push(accessTokenCookie);

        const refreshTokenCookie = cookie.serialize(
          COOKIE.REFRESH_TOKEN.NAME,
          refreshToken,
          COOKIE.REFRESH_TOKEN.SET,
        );
        cookies.push(refreshTokenCookie);
      } else {
        const query = querystring.stringify({ error: 'LOGIN_FAILED' });
        path = `${path}?${query}`;
      }
    }
  }
  res.setHeader('set-cookie', cookies);
  res.redirect(302, path);
}

export default handler;
