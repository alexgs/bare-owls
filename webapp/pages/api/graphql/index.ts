/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloServer } from 'apollo-server-micro';
import { DateTimeResolver } from 'graphql-scalars';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  asNexusMethod,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from 'nexus';
import path from 'path';

import prisma from 'server-lib/prisma';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');

const UserAccount = objectType({
  name: 'UserAccount',
  definition(t) {
    t.string('id');
    t.string('username');
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('users', {
      type: 'UserAccount',
      resolve: () => {
        return prisma.userAccount.findMany();
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, UserAccount],
  outputs: {
    typegen: path.join(process.cwd(), 'pages/api/graphql/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages/api/graphql/schema.graphql'),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({ schema });

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
