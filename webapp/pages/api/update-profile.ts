/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'server-lib';

async function handleFormPost(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  res.json({ body: req.body });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await handleFormPost(req, res);
  } else {
    res.json({ message: 'Nothing to see here.' });
  }
}

export default handler;
