/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) {
      res.status(400).json({ message: 'Session ID not found.' });
      return;
    }

    await prisma.session.delete({ where: { id: sessionId } });
    res.json({ message: 'Session deleted.' });
    return;
  } else {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    res.status(400).json({ message: `Unsupported method: ${req.method}` });
    return;
  }
}

export default handler;
