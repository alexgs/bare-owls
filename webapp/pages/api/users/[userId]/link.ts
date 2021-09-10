/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
import join from 'url-join';

import { PUBLIC } from 'lib';
import { getConfig } from 'server-lib';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    const { AUTH_API_KEY, AUTH_ORIGIN_INTERNAL } = getConfig();
    const userinfoEndpoint = join(
      AUTH_ORIGIN_INTERNAL,
      `/api/user/${req.query.userId as string}`,
    );
    const response = await got.get(userinfoEndpoint, {
      headers: {
        Authorization: AUTH_API_KEY,
      },
      responseType: 'json',
      throwHttpErrors: false,
    });

    if (response.statusCode === 200) {
      res.json({ linkStatus: PUBLIC.AUTH_LINK.LINKED });
    } else if (response.statusCode === 404) {
      res.json({ linkStatus: PUBLIC.AUTH_LINK.UNLINKED });
    } else {
      throw new Error(`${response.statusCode} ${response.statusMessage ?? ''}`);
    }
  }
}

export default handler;
