/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import FusionAuthClient from '@fusionauth/typescript-client';
import * as cookie from 'cookie';
import {isBefore} from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { getConfig } from 'server-lib';

interface FusionAuthClaims {
  aud: string;
  authenticationType: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  sub: string;
}

function getClaims(jwt?: string): FusionAuthClaims {
  if (!jwt) {
    return {
      aud: '',
      authenticationType: '',
      email: '',
      email_verified: false,
      exp: 0,
      iat: 0,
      iss: '',
      jti: '',
      sub: '',
    };
  }

  const base64Claims = jwt.split('.')[1];
  const claimsJson = Buffer.from(base64Claims, 'base64').toString();
  return JSON.parse(claimsJson) as FusionAuthClaims;
}

function isExpired(jwt: string): boolean {
  const claims = getClaims(jwt);
  const expiresAt = claims.exp * 1000;
  return isBefore(Date.now(), expiresAt);
}

// TODO Configure JWT signing (https://fusionauth.io/docs/v1/tech/tutorials/json-web-tokens/)

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const {
    AUTH_ORIGIN_INTERNAL,
    CLIENT_ID,
    CLIENT_SECRET,
    COOKIE,
  } = getConfig();
  const cookies: string[] = [];

  let accessToken: string | undefined = req.cookies[COOKIE.ACCESS_TOKEN.NAME];
  let refreshToken: string | undefined = req.cookies[COOKIE.REFRESH_TOKEN.NAME];
  if (!refreshToken) {
    // TODO Redirect to login page
  } else if (!accessToken || isExpired(accessToken)) {
    const client = new FusionAuthClient(CLIENT_ID, AUTH_ORIGIN_INTERNAL);
    const response = await client.exchangeRefreshTokenForAccessToken(refreshToken, CLIENT_ID, CLIENT_SECRET, '', '');

    if (response.statusCode !== 200) {
      throw response.exception;
    }
    const tokens = response.response;
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;

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
    }
  } else {
    // TODO Verify the token signature
    // TODO Check for token revocation
  }

  // TODO Get the claims
  const claims = getClaims(accessToken);

  res.setHeader('set-cookie', cookies);
  res.json({ claims });
}

export default handler;
