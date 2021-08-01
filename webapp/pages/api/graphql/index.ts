/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import { makeSchema } from 'nexus';
import path from 'path';

import { getSession } from 'server-lib';
import { ApolloContext } from 'types';

import * as types from './types';

interface ServerContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(process.cwd(), 'pages/api/graphql/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages/api/graphql/schema.graphql'),
  },
});

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }: ServerContext): Promise<ApolloContext> => {
    const session = await getSession(req);
    return { session };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<boolean | void> {
  // Stuff required for Apollo Studio
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  // GraphQL handler
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}
