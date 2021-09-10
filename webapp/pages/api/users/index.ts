/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  const { query } = req;
  res.json({ query });
}

export default handler;
