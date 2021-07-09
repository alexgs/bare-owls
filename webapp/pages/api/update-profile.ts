/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'server-lib';

async function handleFormPost(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);

  // TODO ??? Is this really working? ???
  if (typeof session.data?.tokenId === 'undefined') {
    // res.status(500).json({ message: 'No token ID' });
    // return;
    throw new Error('No token ID.');
  }
  if (session.data?.tokenId !== req.body?.tokenId) {
    // res.status(500).json({ message: 'Mismatch in token IDs.'}); // TODO Send a user-safe error message
    // return;
    // TODO Logger with informative server error
    throw new Error('Mismatch in token IDs.');
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
