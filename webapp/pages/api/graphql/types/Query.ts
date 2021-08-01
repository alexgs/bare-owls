/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { objectType } from 'nexus';

import prisma from 'server-lib/prisma';
import { ApolloContext } from 'types';

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('emails', {
      type: 'UserEmail',
      resolve: () => {
        return prisma.userEmail.findMany();
      },
    });
    t.list.field('users', {
      type: 'UserAccount',
      resolve: () => {
        return prisma.userAccount.findMany({ orderBy: { username: 'asc' } });
      },
    });
    t.nullable.field('session', {
      type: 'Session',
      resolve: (_root, _args, context: ApolloContext) => {
        if (context.session) {
          return prisma.session.findFirst({ where: { id: context.session.id } });
        }
        return null;
      },
    });
  },
});
