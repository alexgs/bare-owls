/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { getAccessToken, getClaims } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const accessToken = await getAccessToken(req, res);
  if (accessToken) {
    const claims = getClaims(accessToken);
    res.json({ claims });
  }
}

export default handler;
