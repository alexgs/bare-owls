/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { nanoid } from 'nanoid';

import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE } from 'lib';

interface Session {
  user?: {
    email: string;
    id: string;
    name: string;
  },
  expires: Date;
}

function generateSessionId(): string {
  return nanoid();
}

function getSession(req: NextApiRequest): Session {
  const cookie = req.cookies[COOKIE.SESSION];
  if (!cookie) {
    return {
      expires: new Date(0),
    };
  }
  // TODO Unseal cookie to get the session ID
  // TODO Retrieve user data from the session store
}

// TODO Look at how sessions are handled in Hapi. Are there OWASP guidelines
//   or something? Maybe that Node.js security book?

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSession(req);
}

export default handler;
