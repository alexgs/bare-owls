/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { createLogger, formatFilename } from 'server-lib';
import { unsupportedMethod } from 'server-lib/rest-helpers';

interface RequestBody {
  request: {
    operationName?: string;
    query: string;
    variables?: Record<string, number | string>;
  };
}

// HTTP Codes that Hasura expects (see [webhook docs][1])
// [1]: https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook.html#response
const RESP_CODE = {
  FAILURE: 401,
  SUCCESS: 200,
} as const;

const logger = createLogger(formatFilename(__filename));

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    // query IntrospectionQuery {
    const body = req.body as RequestBody;
    const stopIndex = body.request.query.indexOf('{');
    const preface = body.request.query.substring(0, stopIndex).trim();
    logger.debug(`GraphQL query preface: ${preface}`);

    const [method, operation] = preface.split(' ');
    logger.debug(`GraphQL query method: ${method}`);
    logger.debug(`GraphQL query operation: ${operation}`);
    return res.json({ message: 'ok' });
  } else {
    logger.info(`Unsupported method ${req.method?.toUpperCase() ?? '<NONE>'}`);
    return unsupportedMethod(req, res);
  }
}

export default handler;
