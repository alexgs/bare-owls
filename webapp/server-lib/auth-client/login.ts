/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { getConfig, prisma } from 'server-lib';

import { createLogger } from '../logger'; // Webpack gets testy if we import these from 'server-lib' :unamused:

import { server } from './auth-server';
import { LoginResult, Tokens } from './types';
import { updateUserData } from './update-user-data';

interface ResponseBody {
  refreshToken: string;
  token: string;
  user: {
    id: string;
  };
}

const logger = createLogger('server-lib/auth-client/login');

export async function login(
  username: string,
  password: string,
): Promise<LoginResult> {
  const { WEBAPP_CDN_APP_ID, WEBAPP_CORE_APP_ID } = getConfig();
  const output = {
    status: 'loading',
    tokens: {} as { [key: string]: Tokens },
  };

  // Initial login
  const firstResponse = await server.post<ResponseBody>('api/login', {
    json: {
      password,
      applicationId: WEBAPP_CORE_APP_ID,
      loginId: username,
    },
  });
  if (firstResponse.statusCode !== 200) {
    logger.debug('Error on initial login.');
    output.status = 'error';
    return output;
  }

  // Push claims to FusionAuth
  const subscriptions = await prisma.channelSubscription.findMany({
    where: { userId: firstResponse.body.user.id },
    include: { tier: true },
  });
  const claims = subscriptions.map(
    (sub) => `${sub.channelId}:${sub.tier.slug}`,
  );
  const claimsResponse = await updateUserData(username, { claims });
  if (claimsResponse.status === 'error') {
    logger.debug('Error when updating claims.');
    output.status = 'error';
    return output;
  }

  // Core app login
  const coreResponse = await server.post<ResponseBody>('api/login', {
    json: {
      password,
      applicationId: WEBAPP_CORE_APP_ID,
      loginId: username,
    },
  });
  if (coreResponse.statusCode === 200) {
    // Don't update `output.status` here, since there is still one more step
    output.tokens[WEBAPP_CORE_APP_ID] = {
      accessToken: coreResponse.body.token,
      refreshToken: coreResponse.body.refreshToken,
    };
  } else {
    let message = `Status code ${coreResponse.statusCode}`;
    if (coreResponse.statusCode === 202) {
      message = `User \`${username}\` is not registered with the app`;
    }
    logger.debug(`Error logging into Core app >> ${message}.`);
    output.status = 'error';
  }

  // CDN app login
  const cdnResponse = await server.post<ResponseBody>('api/login', {
    json: {
      password,
      applicationId: WEBAPP_CDN_APP_ID,
      loginId: username,
    },
  });
  if (cdnResponse.statusCode === 200) {
    output.status = 'ok';
    output.tokens[WEBAPP_CDN_APP_ID] = {
      accessToken: cdnResponse.body.token,
      refreshToken: cdnResponse.body.refreshToken,
    };
  } else {
    let message = `Status code ${cdnResponse.statusCode}`;
    if (cdnResponse.statusCode === 202) {
      message = `User \`${username}\` is not registered with the app`;
    }
    logger.debug(`Error logging into CDN app >> ${message}.`);
    output.status = 'error';
  }

  return output;
}
