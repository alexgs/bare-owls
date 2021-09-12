/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE } from './constants';

export function unsupportedMethod(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  res.status(HTTP_CODE.BAD_REQUEST).json({
    message: `Unsupported method ${req.method?.toUpperCase() ?? '<NONE>'}`,
  });
}
