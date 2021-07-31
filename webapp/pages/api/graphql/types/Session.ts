/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { UserAccount as PrismaUser } from '@prisma/client';
import { objectType } from 'nexus';

import { prisma } from 'server-lib';

export const Session = objectType({
  name: 'Session',
  nonNullDefaults: {
    input: true,
    output: true,
  },
  definition(t) {
    t.string('id');
    t.string('displayName');
    t.nullable.json('data');
    t.string('email');
    t.date('expires');
    t.field('account', {
      type: 'UserAccount',
      resolve: (source) =>
        prisma.userEmail
          .findUnique({ where: { id: source.id } })
          .account() as Promise<PrismaUser>,
    });
    t.date('createdAt');
    t.date('updatedAt');
  },
});
