/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import * as cookie from 'cookie';
import { nanoid } from 'nanoid';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  CALLBACK_URL,
  COOKIE,
  COOKIE_OPTIONS,
  IRON_OPTIONS,
  IRON_SEAL,
  getOidcClient,
  startSession,
} from 'server-lib';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const nonce = req.cookies[COOKIE.NONCE];
    if (!nonce) {
      throw new Error('Unable to load nonce from cookie');
    }

    // Delete the nonce cookie
    const nonceCookie = cookie.serialize(COOKIE.NONCE, '', COOKIE_OPTIONS.NONCE_RM);

    const client = await getOidcClient();
    const params = client.callbackParams(req);
    const tokens = await client.callback(CALLBACK_URL, params, { nonce });

    const claims = tokens.claims();
    const sessionId = await startSession({
      email: claims.email as string,
      id: nanoid(),
      name: claims.name as string,
    });
    const sealedId = await Iron.seal(sessionId, IRON_SEAL, IRON_OPTIONS);
    const sessionCookie = cookie.serialize(COOKIE.SESSION, sealedId, COOKIE_OPTIONS.SESSION_SET);
    res.setHeader('set-cookie', [nonceCookie, sessionCookie]);
  }

  res.redirect(302, '/');
}

const exampleClaims = {
  'nickname': 'alex.nebula99',
  'name': 'alex.nebula99@gmail.com',
  'updated_at': '2021-06-25T19:01:43.605Z',
  'email': 'alex.nebula99@gmail.com',
  'email_verified': true,
  'iss': 'https://ickyzoo.auth0.com/',
  'sub': 'auth0|5f9a2086418fef0068432d33',
  'aud': '4b8knwdjR5LP5qKIJnXlzvD8sEag3c2L',
  'iat': 1624647703,
  'exp': 1624683703,
  'at_hash': '1hcZboNe_MaFYTZ-jsCWJw',
  'nonce': 'JXRW6XKlLc0GR6WeneyOex5QtAACS4x43SdTHKSvI14',
};

export default handler;
