/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE, PRIVATE, getAccessToken, getSession } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const result = await getAccessToken(req, res);
  if (result.status === PRIVATE.OK) {
    const session = await getSession(result.token);
    res.json({ session });
  } else if (
    result.status === PRIVATE.ERROR.ACCESS_TOKEN.INVALID_JWT ||
    result.status === PRIVATE.ERROR.ACCESS_TOKEN.NO_REFRESH_TOKEN
  ) {
    res.status(HTTP_CODE.UNAUTHORIZED).end();
  } else {
    res.status(HTTP_CODE.SERVER_ERROR).json({ ...result });
  }
}

export default handler;
