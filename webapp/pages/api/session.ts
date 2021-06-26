/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'server-lib';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSession(req);
}

export default handler;
