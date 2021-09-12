/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

import { PUBLIC } from 'lib';
import { HTTP_CODE, auth, prisma } from 'server-lib';
import { unsupportedMethod } from 'server-lib/rest-helpers';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    const requestBody = await schema.validate(req.body);

    const result = await prisma.userEmail
      .findUnique({ where: { original: requestBody.email } })
      ?.account({ select: { username: true } });
    if (result) {
      const payload = await auth.login(result.username, requestBody.password);
      res.json({ payload });
    } else {
      res.status(HTTP_CODE.BAD_REQUEST).json({ message: PUBLIC.ERROR });
    }
  } else {
    return unsupportedMethod(req, res);
  }
}

export default handler;
