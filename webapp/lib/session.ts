/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import add from 'date-fns/add'
import { nanoid } from 'nanoid';
import { NextApiRequest } from 'next';

import { COOKIE, IRON_OPTIONS, IRON_UNSEAL } from 'lib';

interface Session {
  user?: UserData;
  expires: Date;
}

type SessionId = string;

interface UserData {
  email: string;
  id: string;
  name: string;
}

const store: Record<string, Session> = {};

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
  const session = store[sessionId];
  if (!session) {
    return {
      expires: new Date(0),
    };
  }
  return session;
}

export function startSession(data: UserData): SessionId {
  const session: Session = {
    user: data,
    expires: add(Date.now(), { days: 7 }),
  }
  const id = generateSessionId();
  store[id] = session;
  return id;
}
