/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { LOGIN_PATH } from 'lib';
import { STATUS, getAccessToken, getClaims } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const result = await getAccessToken(req, res);
  if (result.status === STATUS.OK) {
    const claims = getClaims(result.token);
    res.json({ claims });
  } else if (
    result.status === STATUS.ERROR.ACCESS_TOKEN.NO_REFRESH_TOKEN ||
    result.status === STATUS.ERROR.ACCESS_TOKEN.NOT_RECEIVED
  ) {
    // TODO This should really be a response to tell the client to redirect, or the client should handle code 302
    res.redirect(302, LOGIN_PATH);
  } else {
    res.json({ ...result });
  }
}

export default handler;
