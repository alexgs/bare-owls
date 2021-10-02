/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

import { PUBLIC } from 'lib';
import {
  HTTP_CODE,
  auth,
  createLogger,
  formatFilename,
  getConfig,
  prisma,
} from 'server-lib';
import { setTokenCookies, unsupportedMethod } from 'server-lib/rest-helpers';

const logger = createLogger(formatFilename(__filename));
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    const { WEBAPP_CDN_APP_ID, WEBAPP_CORE_APP_ID } =
      getConfig();
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
      if (payload.status !== 'ok') {
        logger.warn(`Failed to authenticate user \`${result.username}\`.`);
        return res
          .status(HTTP_CODE.BAD_REQUEST)
          .json({ message: PUBLIC.ERROR });
      }

      logger.info(`Successfully authenticated user \`${result.username}\`.`);
      const body = {
        cdnAccessToken: payload.tokens[WEBAPP_CDN_APP_ID].accessToken,
        message: PUBLIC.OK,
      };
      setTokenCookies(res, payload.tokens[WEBAPP_CORE_APP_ID]);
      return res.json(body);
    } else {
      logger.warn(
        `No account matched to email address \`${requestBody.email}\`.`,
      );
      return res.status(HTTP_CODE.BAD_REQUEST).json({ message: PUBLIC.ERROR });
    }
  } else {
    return unsupportedMethod(req, res);
  }
}

export default handler;
