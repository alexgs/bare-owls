/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import FusionAuthClient from '@fusionauth/typescript-client';
import * as cookie from 'cookie';
import { isAfter } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { LOGIN_PATH } from 'lib';
import { COOKIE_HEADER, getConfig } from 'server-lib';
import { FusionAuthClaims } from 'types';

// --- PRIVATE FUNCTIONS ---

function isExpired(jwt: string): boolean {
  const claims = getClaims(jwt);
  const expiresAt = claims.exp * 1000;
  return isAfter(Date.now(), expiresAt);
}

// --- PUBLIC FUNCTIONS ---

export async function getAccessToken(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> {
  const { AUTH_ORIGIN_INTERNAL, CLIENT_ID, CLIENT_SECRET, COOKIE } =
    getConfig();
  const client = new FusionAuthClient(CLIENT_ID, AUTH_ORIGIN_INTERNAL);
  const cookies: string[] = [];

  let accessToken: string | undefined = req.cookies[COOKIE.ACCESS_TOKEN.NAME];
  let refreshToken: string | undefined = req.cookies[COOKIE.REFRESH_TOKEN.NAME];
  if (!refreshToken) {
    res.redirect(302, LOGIN_PATH);
    return null;
  } else if (!accessToken || isExpired(accessToken)) {
    const response = await client.exchangeRefreshTokenForAccessToken(
      refreshToken,
      CLIENT_ID,
      CLIENT_SECRET,
      '',
      '',
    );
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
    } else {
      res.status(500).json({ message: 'Unable to retrieve tokens.' });
      return null;
    }
  } else {
    const response = await client.validateJWT(accessToken);
    if (response.statusCode !== 200) {
      throw response.exception;
    }
  }
  if (cookies.length > 0) {
    res.setHeader(COOKIE_HEADER, cookies);
  }
  return accessToken;
}

export function getClaims(jwt?: string): FusionAuthClaims {
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
