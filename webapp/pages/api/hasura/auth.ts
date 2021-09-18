/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { createLogger, formatFilename } from 'server-lib';
import { Tokens } from 'server-lib/auth-client/types';
import { unsupportedMethod } from 'server-lib/rest-helpers';

interface GraphQlRequest {
  operationName?: string;
  query: string;
  variables?: Record<string, number | string>;
}

interface PrefaceData {
  method: string;
  operation: string;
}

interface WebhookBody {
  headers: Record<string, string>;
  request: GraphQlRequest;
}

// HTTP Codes that Hasura expects (see [webhook docs][1])
// [1]: https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook.html#response
const RESP_CODE = {
  FAILURE: 401,
  SUCCESS: 200,
} as const;

const logger = createLogger(formatFilename(__filename));

function getTokensFromHeaders(headers: Record<string, string>): Tokens {
  const cookies = cookie.parse(headers.Cookie ?? '');
  return {
    accessToken: cookies['access-token'] ?? '<missing>',
    refreshToken: cookies['refresh-token'] ?? '<missing>',
  }
}

function parseGraphQlPreface(request: GraphQlRequest): PrefaceData {
  const query = request.query.trim();
  const methodStopIndex = query.indexOf(' ');

  let operation = request.operationName;
  if (!operation) {
    const braceStopIndex = query.indexOf('{');
    const preface = query.substring(0, braceStopIndex).trim();
    const opName = preface.split(' ')[1];
    operation = opName ?? '<unnamed>';
  }
  return {
    operation,
    method: query.substring(0, methodStopIndex).trim(),
  };
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    const webhook = req.body as WebhookBody;
    const {method, operation} = parseGraphQlPreface(webhook.request);
    if (method !== 'query') {
      return res.status(RESP_CODE.FAILURE).end();
    }

    // logger.debug(`Header keys: ${Object.keys(webhook.headers).join()}`);
    // logger.debug(`Cookie: ${webhook.headers.Cookie}`);
    // const cookies = cookie.parse(webhook.headers.Cookie)
    // logger.debug(`Cookies: ${JSON.stringify(cookies)}`);
    const tokens = getTokensFromHeaders(webhook.headers);
    logger.debug(`Tokens: ${JSON.stringify(tokens)}`);

    return res.json({ message: 'ok' });
  } else {
    logger.info(`Unsupported method ${req.method?.toUpperCase() ?? '<NONE>'}`);
    return unsupportedMethod(req, res);
  }
}

export default handler;
