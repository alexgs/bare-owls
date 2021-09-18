/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { PUBLIC } from 'lib';
import { HTTP_CODE, auth, getConfig } from 'server-lib';
import { clearTokenCookies, unsupportedMethod } from 'server-lib/rest-helpers';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    const { COOKIE } = getConfig();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const global = !!req.body.global;

    const refreshToken: string | undefined = req.cookies[COOKIE.REFRESH_TOKEN.NAME];
    if (!refreshToken) {
      console.log(`| Warn | No refresh token in request cookies.`);
      return res.status(HTTP_CODE.BAD_REQUEST).json({ message: PUBLIC.ERROR });
    }

    const result = await auth.logout(refreshToken, global);
    if (result === 'ok') {
      clearTokenCookies(res);
      return res.json({ message: PUBLIC.OK });
    }
    return res.status(HTTP_CODE.SERVER_ERROR).json({ message: PUBLIC.ERROR });
  } else {
    return unsupportedMethod(req, res);
  }
}

export default handler;
