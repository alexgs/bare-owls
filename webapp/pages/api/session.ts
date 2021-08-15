/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse): void {
  return res.json({ displayName: 'Alex' });
}

export default handler;
