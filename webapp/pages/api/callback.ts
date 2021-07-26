/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import * as cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  COOKIE,
  COOKIE_OPTIONS,
  IRON_OPTIONS,
  IRON_SEAL,
  handleOidcResponse,
} from 'server-lib';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const nonceCookie = cookie.serialize(
    COOKIE.NONCE,
    '',
    COOKIE_OPTIONS.NONCE_RM,
  );
  const cookies = [nonceCookie];
  let path = '/';

  if (req.method === 'POST') {
    const { registerNewUser, sessionId } = await handleOidcResponse(req);
    const sealedId = await Iron.seal(sessionId, IRON_SEAL, IRON_OPTIONS);
    const sessionCookie = cookie.serialize(
      COOKIE.SESSION,
      sealedId,
      COOKIE_OPTIONS.SESSION_SET,
    );
    cookies.push(sessionCookie);

    if (registerNewUser) {
      path = `/register`;
    }
  }
  res.setHeader('set-cookie', cookies);
  res.redirect(302, path);
}

export default handler;
