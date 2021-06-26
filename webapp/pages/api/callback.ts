/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as cookie from 'cookie';
import { CALLBACK, COOKIE, getOidcClient } from 'lib';
import type { NextApiRequest, NextApiResponse } from 'next';

const COOKIE_OPTIONS: cookie.CookieSerializeOptions = {
  httpOnly: true,
  expires: new Date(0),
  path: '/',
  secure: true,
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const nonce = req.cookies['bare-owls-nonce'];
    if (!nonce) {
      throw new Error('Unable to load nonce from cookie');
    }

    // Delete the nonce cookie
    const nonceCookie = cookie.serialize(COOKIE.NONCE, '', COOKIE_OPTIONS);
    res.setHeader('set-cookie', nonceCookie);

    const client = await getOidcClient();
    const params = client.callbackParams(req);
    const tokens = await client.callback(CALLBACK, params, { nonce });

    // console.log('received and validated tokens %j', tokens);
    console.log('validated ID Token claims %j', tokens.claims());
    // TODO Save session data, get back a session ID
    // TODO Seal the session ID
    // TODO Put the sealed data in a cookie
  }

  res.redirect(302, '/');
}

const exampleCliams = {
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
