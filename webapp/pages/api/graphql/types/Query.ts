/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { objectType } from 'nexus';

import prisma from 'server-lib/prisma';

export const Query = objectType({
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
