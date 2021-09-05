/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import FusionAuthClient from '@fusionauth/typescript-client';
import Iron from '@hapi/iron';
import * as cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as querystring from 'query-string';

import { COOKIE_HEADER, getConfig } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const {
    AUTH_ORIGIN_INTERNAL,
    CALLBACK_URL,
    CLIENT_ID,
    CLIENT_SECRET,
    COOKIE,
    IRON_OPTIONS,
    IRON_UNSEAL,
  } = getConfig();

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

      const client = new FusionAuthClient(CLIENT_ID, AUTH_ORIGIN_INTERNAL);
      const response = await client.exchangeOAuthCodeForAccessTokenUsingPKCE(
        req.query.code as string,
        CLIENT_ID,
        CLIENT_SECRET,
        CALLBACK_URL,
        codeVerifier,
      );

      if (response.statusCode !== 200) {
        throw response.exception;
      }
      const tokens = response.response;
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
  res.setHeader(COOKIE_HEADER, cookies);
  res.redirect(302, path);
}

export default handler;
