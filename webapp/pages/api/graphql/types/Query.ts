/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { nonNull, objectType } from 'nexus';

import prisma from 'server-lib/prisma';

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
        return prisma.userAccount.findMany();
      },
    });
    t.nullable.field('session', {
      type: 'Session',
      args: { sessionId: nonNull('String') },
      resolve: (_root, args) => {
        return prisma.session.findFirst({ where: { id: args.sessionId } });
      },
    });
  },
});
