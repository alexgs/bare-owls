/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    res.json({ payload: req.body as Record<string, unknown> })
  } else {
    res.status(HTTP_CODE.BAD_REQUEST).json({
      message: `Unsupported method ${req.method?.toUpperCase() ?? '<NONE>'}`,
    });
  }
}

export default handler;
