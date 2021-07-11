/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { getSession, validateSession } from 'server-lib';

async function handleFormPost(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const isValid = validateSession(session)

  if (!isValid) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // TODO Create user account
  // TODO Link account to token
  // TODO Save email address
  // res.json({
  //   body: req.body,
  //   message: 'It works!',
  //   session: typeof session.tokenId,
  // });
  console.log({
    body: req.body,
    message: 'It works!',
    session: typeof session.data?.tokenId,
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await handleFormPost(req, res);
    res.json({});
  } else {
    res.json({ message: 'Nothing to see here.' });
  }
}

export default handler;
