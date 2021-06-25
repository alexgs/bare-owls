/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { CALLBACK, getAuth0Client } from 'lib';
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const nonce = req.cookies['bare-owls-nonce'];
    if (!nonce) {
      throw new Error('Unable to load nonce from cookie');
    }

    const client = await getAuth0Client();
    const params = client.callbackParams(req);
    const tokens = await client.callback(CALLBACK, params, { nonce });
    // TODO Delete the nonce cookie
    console.log('received and validated tokens %j', tokens);
    console.log('validated ID Token claims %j', tokens.claims());
  }

  res.redirect(302, '/');
}

export default handler;
