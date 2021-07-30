/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloServer } from 'apollo-server-micro';
import { DateTimeResolver } from 'graphql-scalars';
import { NextApiRequest, NextApiResponse } from 'next';
import { asNexusMethod, makeSchema } from 'nexus';
import path from 'path';

import * as types from './types';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(process.cwd(), 'pages/api/graphql/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages/api/graphql/schema.graphql'),
  },
});

const apolloServer = new ApolloServer({ schema });

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
