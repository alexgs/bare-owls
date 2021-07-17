/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { getSession, prisma } from 'server-lib';

interface HandlerOutput {
  message: Record<string, unknown> | string;
  status: number;
}

const inputSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  name: Joi.string().trim().required(),
  username: Joi.string().trim().min(3).pattern(/^[A-Za-z0-9_\-.]+$/).required(),
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

  const { value, error } = inputSchema.validate({
    email: req.body.email,
    name: req.body.name,
    username: req.body.username,
  });
  if (error) {
    return {
      status: 400,
      message: { details: error.details },
    };
  }

  await prisma.userAccount.update({
    data: {
      displayName: value.name,
      email: {
        set: { original: value.email },
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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, status } = await handleFormPost(req);
    res.status(status).json({ message });
  } else {
    res.json({ message: 'Nothing to see here.' });
  }
}

export default handler;
