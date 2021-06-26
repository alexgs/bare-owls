/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import * as env from 'env-var';
import ms from 'ms';
import { nanoid } from 'nanoid';
import { NextApiRequest } from 'next';

import { COOKIE, IRON_OPTIONS, IRON_UNSEAL, prisma } from 'server-lib';

const SESSION_TTL = env.get('SESSION_TTL').required().asString();

export interface Session {
  user?: UserData;
  expires: Date;
}

type SessionId = string;

interface UserData {
  email: string;
  id: string;
  name: string;
}

function generateSessionId(): string {
  return nanoid();
}

export async function getSession(req: NextApiRequest): Promise<Session> {
  const cookie = req.cookies[COOKIE.SESSION];
  if (!cookie) {
    return {
      expires: new Date(0),
    };
  }

  const sessionId = await Iron.unseal(cookie, IRON_UNSEAL, IRON_OPTIONS);
  const data = await prisma.session.findUnique({ where: { id: sessionId }});
  if (!data) {
    return {
      expires: new Date(0),
    };
  }
  return {
    expires: data.expires,
    user: {
      id: data.userId,
      email: data.email,
      name: data.displayName,
    },
  };
}

export async function startSession(data: UserData): Promise<SessionId> {
  const expiry = Date.now() + ms(SESSION_TTL);
  const session: Session = {
    user: data,
    expires: new Date(expiry),
  }
  const id = generateSessionId();
  await prisma.session.create({
    data: {
      id,
      displayName: data.name,
      email: data.email,
      expires: session.expires,
      userId: data.id,
    }
  });
  return id;
}
