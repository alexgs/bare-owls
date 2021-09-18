/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { auth, createLogger, formatFilename } from 'server-lib';
import { Tokens } from 'server-lib/auth-client';
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

function getTokensFromWebhook(webhook: WebhookBody): Tokens {
  const { headers } = webhook;
  const output: Tokens = {
    accessToken: '<missing>',
    refreshToken: '<missing>',
  };

  const headerKeys = Object.keys(headers);
  let index = 0;
  let done = false;
  while (index < headerKeys.length && !done) {
    const currentKey = headerKeys[index];
    if (currentKey.toUpperCase() === 'COOKIE') {
      const cookies = cookie.parse(headers[currentKey]);
      output.accessToken = cookies['access-token'];
      output.refreshToken = cookies['refresh-token'];
      done = true;
    }
    index++;
  }

  return output;
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

    const tokens = getTokensFromWebhook(webhook);
    const result = await auth.validateJwt(tokens.accessToken);
    logger.debug(`JWT validation result: ${JSON.stringify(result)}`);
    if (!result.isValid) {
      return res.status(RESP_CODE.FAILURE).end();
    }

    const { jwt } = result;
    return res.json({
      'X-Hasura-Role': jwt.roles.join(','),
      'X-Hasura-User-Id': jwt.sub,
    });
  } else {
    logger.info(`Unsupported method ${req.method?.toUpperCase() ?? '<NONE>'}`);
    return unsupportedMethod(req, res);
  }
}

export default handler;
