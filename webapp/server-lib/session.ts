/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import * as env from 'env-var';
import ms from 'ms';
import { nanoid } from 'nanoid';
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils';

import { COOKIE, IRON_OPTIONS, IRON_UNSEAL, prisma } from 'server-lib';
import { JsonObject, JsonValue, Session, SessionId, UserData } from 'types';

const SESSION_TTL = env.get('SESSION_TTL').required().asString();

function generateSessionId(): string {
  return nanoid();
}

export async function getSession(req: { cookies: NextApiRequestCookies }): Promise<Session | null> {
  const cookie = req.cookies[COOKIE.SESSION];
  if (!cookie) {
    return null;
  }

  const sessionId = await Iron.unseal(cookie, IRON_UNSEAL, IRON_OPTIONS);
  const data = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!data) {
    return null;
  }

  if (data.expires.getTime() <= Date.now()) {
    return null;
  }

  return {
    data: data.data as JsonObject,
    expires: data.expires,
    id: sessionId,
    user: {
      id: data.accountId,
      email: data.email,
      name: data.displayName,
    },
  };
}

export async function startSession(user: UserData, data?: JsonValue): Promise<SessionId> {
  const expiry = Date.now() + ms(SESSION_TTL);
  const expires = new Date(expiry);
  const id = generateSessionId();
  await prisma.session.create({
    data: {
      data,
      expires,
      id,
      accountId: user.id,
      displayName: user.name,
      email: user.email,
    },
  });
  return id;
}
