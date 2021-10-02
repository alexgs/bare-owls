/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
import join from 'url-join';
import * as yup from 'yup';

import { PUBLIC } from 'lib';
import { PRIVATE, createLogger, formatFilename, getConfig } from 'server-lib';
import { unsupportedMethod } from 'server-lib/rest-helpers';

type CreateResult =
  | typeof PRIVATE.ERROR.AUTH_LINK.CREATE_USER
  | typeof PRIVATE.OK;

type RegisterResult =
  | typeof PRIVATE.ERROR.AUTH_LINK.REGISTER_USER
  | typeof PRIVATE.OK;

interface UserData {
  email: string;
  fullName: string;
  username: string;
}

const logger = createLogger(formatFilename(__filename));
const schema = yup.object().shape({
  displayName: yup.string().required(),
  email: yup.string().email().required(),
  username: yup.string().required(),
});

async function createUser(
  userId: string,
  data: UserData,
): Promise<CreateResult> {
  const { AUTH_DEFAULT_PASSWORD, AUTH_ORIGIN_INTERNAL, WEBAPP_AUTH_API_KEY } =
    getConfig();
  const userinfoEndpoint = join(AUTH_ORIGIN_INTERNAL, `/api/user/${userId}`);
  const userinfoPayload = {
    skipVerification: true,
    user: {
      ...data,
      password: AUTH_DEFAULT_PASSWORD,
    },
  };

  const response = await got.post(userinfoEndpoint, {
    json: userinfoPayload,
    headers: {
      Authorization: WEBAPP_AUTH_API_KEY,
    },
    responseType: 'json',
    throwHttpErrors: false,
  });

  if (response.statusCode !== 200) {
    logger.warn(
      `Error creating user in auth system: ${response.statusCode} ` +
        `${response.statusMessage ?? ''}.`,
    );
    return PRIVATE.ERROR.AUTH_LINK.CREATE_USER;
  }
  return PRIVATE.OK;
}

async function registerUser(
  userId: string,
  appId: string,
): Promise<RegisterResult> {
  const { AUTH_ORIGIN_INTERNAL, WEBAPP_AUTH_API_KEY } = getConfig();
  const registerEndpoint = join(
    AUTH_ORIGIN_INTERNAL,
    `/api/user/registration/${userId}`,
  );
  const registerPayload = {
    registration: {
      applicationId: appId,
      roles: ['FAN'],
    },
  };

  const response = await got.post(registerEndpoint, {
    json: registerPayload,
    headers: {
      Authorization: WEBAPP_AUTH_API_KEY,
    },
    responseType: 'json',
    throwHttpErrors: false,
  });

  if (response.statusCode !== 200) {
    logger.warn(
      `Error registering user with app {${appId}}: ${response.statusCode} ` +
        `${response.statusMessage ?? ''}.`,
    );
    return PRIVATE.ERROR.AUTH_LINK.REGISTER_USER;
  }
  return PRIVATE.OK;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    const { AUTH_ORIGIN_INTERNAL, WEBAPP_AUTH_API_KEY } = getConfig();
    const userinfoEndpoint = join(
      AUTH_ORIGIN_INTERNAL,
      `/api/user/${req.query.userId as string}`,
    );
    const response = await got.get(userinfoEndpoint, {
      headers: {
        Authorization: WEBAPP_AUTH_API_KEY,
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
    const userId = req.query.userId as string;

    // Create user auth account
    const requestBody = await schema.validate(req.body);
    const userData: UserData = {
      email: requestBody.email,
      fullName: requestBody.displayName,
      username: requestBody.username,
    };

    const createResult = await createUser(userId, userData);
    if (createResult !== PRIVATE.OK) {
      return res.json({ linkStatus: PUBLIC.ERROR });
    }

    // Register with each auth application
    const { WEBAPP_CORE_APP_ID, WEBAPP_CDN_APP_ID } = getConfig();
    const appIds = [WEBAPP_CORE_APP_ID, WEBAPP_CDN_APP_ID];
    const registerResults = await Promise.all(
      appIds.map(async (appId): Promise<RegisterResult> => {
        return registerUser(userId, appId);
      }),
    );
    if (registerResults.every((result) => result === PRIVATE.OK)) {
      res.json({ linkStatus: PUBLIC.AUTH_LINK.LINKED });
    }
    return res.json({ linkStatus: PUBLIC.ERROR });
  }

  if (!['GET', 'POST'].includes(req.method ?? '')) {
    return unsupportedMethod(req, res);
  }
}

export default handler;
