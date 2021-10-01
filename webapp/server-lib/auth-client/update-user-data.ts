/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { createLogger, formatFilename } from '../logger';

import { server } from './auth-server';

interface ResponseBody {
  user: {
    active: boolean;
    data?: Record<string, unknown>;
    email: string;
    encryptionScheme: string;
    firstName: string;
    id: string;
    insertInstant: number;
    lastLoginInstant: number;
    lastUpdateInstant: number;
    passwordChangeRequired: boolean;
    passwordLastUpdateInstant: number;
    registrations: unknown[];
    tenantId: string;
    twoFactor: Record<string, unknown>;
    uniqueUsername: string;
    username: string;
    usernameStatus: string;
    verified: boolean;
  };
}

const logger = createLogger('server-lib/auth-client/update-user-data');

export async function updateUserData(username: string, data: Record<string, unknown>): Promise<{ status: string }> {
  // Get the current user
  const payloadResponse = await server.get<ResponseBody>(`api/user?loginId=${username}`);
  if (payloadResponse.statusCode !== 200) {
    // logger.debug('Error fetching user data.');
    logger.debug(`Error fetching user data from ${payloadResponse.request.requestUrl}`);
    return { status: 'error' };
  }

  // Replace the `user.data` value with the `data` argument
  const payload = payloadResponse.body.user;
  payload.data = data;

  // Send PUT request to the FusionAuth server
  const updateResponse = await server.put<ResponseBody>(`api/user/${payload.id}`, {
    json: { user: payload },
  });
  if (updateResponse.statusCode !== 200) {
    logger.debug('Error updating user data.');
    return { status: 'error' };
  }
  return { status: 'ok' };
}
