/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { Tokens } from './auth-client/types';
import { getConfig } from './config';
import { COOKIE_HEADER, HTTP_CODE } from './constants';

export function clearTokenCookies(res: NextApiResponse): void {
  const { COOKIE } = getConfig();
  const cookies: string[] = [];

  const accessTokenCookie = cookie.serialize(
    COOKIE.ACCESS_TOKEN.NAME,
    '',
    COOKIE.ACCESS_TOKEN.RM,
  );
  cookies.push(accessTokenCookie);

  const refreshTokenCookie = cookie.serialize(
    COOKIE.REFRESH_TOKEN.NAME,
    '',
    COOKIE.REFRESH_TOKEN.RM,
  );
  cookies.push(refreshTokenCookie);

  res.setHeader(COOKIE_HEADER, cookies);
}

export function setTokenCookies(res: NextApiResponse, tokens: Tokens): void {
  const { COOKIE } = getConfig();
  const cookies: string[] = [];

  const accessTokenCookie = cookie.serialize(
    COOKIE.ACCESS_TOKEN.NAME,
    tokens.accessToken,
    COOKIE.ACCESS_TOKEN.SET,
  );
  cookies.push(accessTokenCookie);

  const refreshTokenCookie = cookie.serialize(
    COOKIE.REFRESH_TOKEN.NAME,
    tokens.refreshToken,
    COOKIE.REFRESH_TOKEN.SET,
  );
  cookies.push(refreshTokenCookie);

  res.setHeader(COOKIE_HEADER, cookies);
}

export function unsupportedMethod(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  res.status(HTTP_CODE.BAD_REQUEST).json({
    message: `Unsupported method ${req.method?.toUpperCase() ?? '<NONE>'}`,
  });
}
