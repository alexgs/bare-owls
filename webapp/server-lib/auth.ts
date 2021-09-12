/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import FusionAuthClient from '@fusionauth/typescript-client';
import * as cookie from 'cookie';
import { isAfter } from 'date-fns';
import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
import join from 'url-join';

import { COOKIE_HEADER, PRIVATE, getConfig } from 'server-lib';
import { FusionAuthClaims, Session, UserinfoResponse } from 'types';

// --- PRIVATE FUNCTIONS ---

function isExpired(jwt: string): boolean {
  const claims = getClaims(jwt);
  const expiresAt = claims.exp * 1000;
  return isAfter(Date.now(), expiresAt);
}

// --- PUBLIC FUNCTIONS ---

interface AccessTokenOk {
  status: typeof PRIVATE.OK;
  token: string;
}

interface AccessTokenError {
  status:
    | typeof PRIVATE.ERROR.ACCESS_TOKEN.EXCHANGE_REFRESH_ERROR
    | typeof PRIVATE.ERROR.ACCESS_TOKEN.INVALID_JWT
    | typeof PRIVATE.ERROR.ACCESS_TOKEN.NOT_RECEIVED
    | typeof PRIVATE.ERROR.ACCESS_TOKEN.NO_REFRESH_TOKEN
    | typeof PRIVATE.ERROR.UNKNOWN;
  message?: string;
}

type AccessTokenResult = AccessTokenError | AccessTokenOk;

export async function getAccessToken(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<AccessTokenResult> {
  const { AUTH_ORIGIN_INTERNAL, CLIENT_ID, CLIENT_SECRET, COOKIE } =
    getConfig();
  // TODO Get rid of FusionAuth client
  const client = new FusionAuthClient(CLIENT_ID, AUTH_ORIGIN_INTERNAL);
  const cookies: string[] = [];

  let accessToken: string | undefined = req.cookies[COOKIE.ACCESS_TOKEN.NAME];
  let refreshToken: string | undefined = req.cookies[COOKIE.REFRESH_TOKEN.NAME];
  if (!refreshToken) {
    return { status: PRIVATE.ERROR.ACCESS_TOKEN.NO_REFRESH_TOKEN };
  } else if (!accessToken || isExpired(accessToken)) {
    const response = await client.exchangeRefreshTokenForAccessToken(
      refreshToken,
      CLIENT_ID,
      CLIENT_SECRET,
      '',
      '',
    );
    if (response.statusCode !== 200) {
      return {
        message: JSON.stringify({
          statusCode: response.statusCode,
          body: response.exception.message,
        }),
        status: PRIVATE.ERROR.ACCESS_TOKEN.EXCHANGE_REFRESH_ERROR,
      };
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
      return { status: PRIVATE.ERROR.ACCESS_TOKEN.NOT_RECEIVED };
    }
  } else {
    const response = await client.validateJWT(accessToken);
    if (response.statusCode !== 200) {
      return { status: PRIVATE.ERROR.ACCESS_TOKEN.INVALID_JWT };
    }
  }
  if (cookies.length > 0) {
    res.setHeader(COOKIE_HEADER, cookies);
  }
  return {
    status: PRIVATE.OK,
    token: accessToken,
  };
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

export async function getSession(jwt: string): Promise<Session> {
  const { AUTH_ORIGIN_INTERNAL } = getConfig();
  const userinfoEndpoint = join(AUTH_ORIGIN_INTERNAL, '/oauth2/userinfo');
  const response = await got.get(userinfoEndpoint, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    responseType: 'json',
    throwHttpErrors: false,
  });
  if (response.statusCode !== 200) {
    throw new Error(`${response.statusCode} ${response.statusMessage ?? ''}`);
  }

  // TODO Use Yup to validate these fields and perform the type-cast
  const user = response.body as UserinfoResponse;
  // console.log(`>> --- <<\n${JSON.stringify(user)}\n>> --- <<`);

  return {
    email: user.email,
    displayName: user.given_name ?? user.preferred_username,
    emailVerified: user.email_verified,
    firstName: user.given_name,
    lastName: user.family_name,
    userId: user.sub,
    username: user.preferred_username,
  };
}
