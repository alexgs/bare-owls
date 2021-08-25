/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { getConfig, getOidcClient } from 'server-lib';

// TODO Update this file (or maybe just the callback functions?)
// TODO Pass tokens only in cookies

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isExpired(token: string): boolean {
  // TODO Actually check for expiration
  return false;
}

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const config = getConfig();
  const { COOKIE } = config;
  const cookies: string[] = [];

  const accessToken = req.cookies[COOKIE.ACCESS_TOKEN.NAME];
  const refreshToken = req.cookies[COOKIE.REFRESH_TOKEN.NAME];
  if (!refreshToken) {
    // TODO Redirect to login page
  } else if (!accessToken || isExpired(accessToken)) {
    const client = await getOidcClient(config);
    const tokens = await client.refresh(refreshToken);
    const newAccessToken = tokens.access_token;
    const newRefreshToken = tokens.refresh_token;

    if (newAccessToken && newRefreshToken) {
      const accessTokenCookie = cookie.serialize(
        COOKIE.ACCESS_TOKEN.NAME,
        newAccessToken,
        COOKIE.ACCESS_TOKEN.SET,
      );
      cookies.push(accessTokenCookie);

      const refreshTokenCookie = cookie.serialize(
        COOKIE.REFRESH_TOKEN.NAME,
        newRefreshToken,
        COOKIE.REFRESH_TOKEN.SET,
      );
      cookies.push(refreshTokenCookie);
    }
  } else {
    // TODO Verify the token signature
    // TODO Check for token revocation
  }

  // TODO Get the claims
  const jwt = accessToken;

  res.setHeader('set-cookie', cookies);
  res.json({ jwt });
}

export default handler;
