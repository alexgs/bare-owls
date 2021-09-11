/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
import join from 'url-join';
import * as yup from 'yup';

import { PUBLIC } from 'lib';
import { HTTP_CODE, getConfig } from 'server-lib';

const schema = yup.object().shape({
  displayName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  username: yup.string().required(),
});

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

  if (req.method === 'POST') {
    const { AUTH_API_KEY, AUTH_ORIGIN_INTERNAL } = getConfig();

    const requestBody = await schema.validate(req.body);
    const userData = {
      email: requestBody.email,
      fullName: requestBody.displayName,
      password: requestBody.password,
      username: requestBody.username,
    };

    const userinfoEndpoint = join(
      AUTH_ORIGIN_INTERNAL,
      `/api/user/${req.query.userId as string}`,
    );
    const userinfoPayload = {
      skipVerification: true,
      user: userData,
    };

    const response = await got.post(userinfoEndpoint, {
      json: userinfoPayload,
      headers: {
        Authorization: AUTH_API_KEY,
      },
      responseType: 'json',
      throwHttpErrors: false,
    });
    // TODO Register with the "Core" auth application
    if (response.statusCode === 200) {
      res.json({ linkStatus: PUBLIC.AUTH_LINK.LINKED });
    } else {
      throw new Error(`${response.statusCode} ${response.statusMessage ?? ''}`);
    }
  }

  if (!['GET', 'POST'].includes(req.method ?? '')) {
    res
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ message: `Unsupported method ${req.method?.toUpperCase() ?? '<NONE>'}` });
  }
}

export default handler;
