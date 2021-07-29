/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Joi, { ValidationError } from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { getSession, prisma } from 'server-lib';

interface HandlerOutput {
  message: Record<string, unknown> | string;
  status: number;
}

interface Payload {
  email: string;
  name: string;
  username: string;
}

// TODO Replace Joi with Yup
const inputSchema = Joi.object<Payload>({
  email: Joi.string().trim().email().required(),
  name: Joi.string().trim().required(),
  username: Joi.string()
    .trim()
    .min(3)
    .pattern(/^[A-Za-z0-9_\-.]+$/)
    .required(),
});

async function handleFormPost(req: NextApiRequest): Promise<HandlerOutput> {
  const session = await getSession(req);
  if (!session) {
    return {
      status: 403,
      message: 'Not authorized',
    };
  }
  const userId = session.user.id;

  const body = req.body as Payload;
  const { value, error } = inputSchema.validate({
    email: body.email,
    name: body.name,
    username: body.username,
  }) as { value: Payload; error?: ValidationError };
  if (error) {
    return {
      status: 400,
      message: { details: error.details },
    };
  }

  const extantUsernames = await prisma.userAccount.count({where: { username: value.username } });
  if (extantUsernames !== 0) {
    return {
      status: 409,
      message: { details: 'Duplicate username' },
    };
  }

  await prisma.userAccount.update({
    data: {
      displayName: value.name,
      email: {
        // TODO This query assumes there's only one email address, which may not always be true
        updateMany: {
          where: {},
          data: {
            original: value.email,
            simplified: value.email,
          },
        },
      },
      session: {
        updateMany: {
          where: {},
          data: {
            displayName: value.name,
            email: value.email,
          },
        },
      },
      username: value.username,
    },
    where: { id: userId },
  });

  return {
    status: 200,
    message: {
      action: 'REDIRECT',
      location: '/',
    },
  };
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    const { message, status } = await handleFormPost(req);
    res.status(status).json({ message });
  } else {
    res.json({ message: 'Nothing to see here.' });
  }
}

export default handler;
