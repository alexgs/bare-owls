/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { getAccessToken, getSession } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const accessToken = await getAccessToken(req, res);
  if (accessToken) {
    const session = await getSession(accessToken);
    res.json({ session });
  }
}

export default handler;
