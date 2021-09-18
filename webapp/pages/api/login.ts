/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

import { PUBLIC } from 'lib';
import {
  HTTP_CODE,
  TOKEN_CONTEXT,
  auth,
  createLogger,
  getConfig,
  prisma,
} from 'server-lib';
import { setTokenCookies, unsupportedMethod } from 'server-lib/rest-helpers';

const logger = createLogger(__filename);
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    const { AUTH_APP_TOKEN_CONTEXT } = getConfig();
    let requestBody = null;
    try {
      requestBody = await schema.validate(req.body);
    } catch (e) {
      if (e instanceof Error) {
        logger.warn(`Validation error: ${e.message}`);
      } else {
        logger.warn('Unknown error during schema validation:', e);
      }
    }
    if (!requestBody) {
      return res.status(HTTP_CODE.BAD_REQUEST).json({ message: PUBLIC.ERROR });
    }

    const result = await prisma.userEmail
      .findUnique({ where: { original: requestBody.email } })
      ?.account({ select: { username: true } });
    if (result) {
      const payload = await auth.login(result.username, requestBody.password);
      // TODO Use constants for `payload.status`
      if (payload.status === 'ok') {
        logger.info(`Successfully authenticated user ${result.username}.`);
        const body: Record<string, string> = { message: PUBLIC.OK };

        // Send tokens to the client. **NB:** If more than one app is set to
        // "secure," then only one will get its tokens into the cookies. Which
        // app wins is non-deterministic.
        Object.keys(payload.tokens).forEach((appId) => {
          if (AUTH_APP_TOKEN_CONTEXT[appId] === TOKEN_CONTEXT.SECURE) {
            setTokenCookies(res, payload.tokens[appId]);
          } else if (AUTH_APP_TOKEN_CONTEXT[appId] === TOKEN_CONTEXT.OPEN) {
            // Send **only** access token to "open" apps
            body[appId] = payload.tokens[appId].accessToken;
          } else {
            logger.warn(`Unknown token context "${AUTH_APP_TOKEN_CONTEXT[appId]}"`);
          }
        });
        return res.json(body);
      }
      logger.warn(`Failed to authenticate user ${result.username}.`);
      return res.status(HTTP_CODE.BAD_REQUEST).json({ message: PUBLIC.ERROR });
    } else {
      logger.warn(`No account matched to email address ${requestBody.email}.`);
      return res.status(HTTP_CODE.BAD_REQUEST).json({ message: PUBLIC.ERROR });
    }
  } else {
    return unsupportedMethod(req, res);
  }
}

export default handler;
