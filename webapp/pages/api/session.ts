/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

// TODO Update this file (or maybe just the callback functions?)
// TODO Pass tokens only in cookies

function handler(req: NextApiRequest, res: NextApiResponse): void {
  return res.json({ displayName: 'Alex' });
}

export default handler;
