/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { UserAccount as PrismaUser } from '@prisma/client';
import { objectType } from 'nexus';

import { prisma } from 'server-lib';

export const UserAccount = objectType({
  name: 'UserAccount',
  nonNullDefaults: {
    input: true,
    output: true,
  },
  definition(t) {
    t.string('id');
    t.string('username');
    t.nullable.string('displayName');
    t.list.field('email', {
      type: 'UserEmail',
      resolve: (parent) =>
        prisma.userEmail.findMany({ where: { accountId: parent.id } }),
    });
    t.date('createdAt');
    t.date('updatedAt');
  },
});

export const UserEmail = objectType({
  name: 'UserEmail',
  nonNullDefaults: {
    input: true,
    output: true,
  },
  definition(t) {
    t.int('id');
    t.string('original');
    t.string('simplified');
    t.field('account', {
      type: 'UserAccount',
      resolve: (source) =>
        prisma.userEmail
          .findUnique({ where: { id: source.id } })
          .account() as Promise<PrismaUser>,
    });
    t.boolean('verified');
    t.date('createdAt');
    t.date('updatedAt');
  },
});

export const UserRole = objectType({
  name: 'UserRole',
  nonNullDefaults: {
    input: true,
    output: true,
  },
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('description');
    t.list.field('users', {
      type: 'UserAccount',
      resolve: (parent) =>
        prisma.userAccount.findMany({ where: { roleId: parent.id } }),
    });
    t.date('createdAt');
    t.date('updatedAt');
  },
});
