/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient, UserAccount, UserEmail, UserRole } from '@prisma/client';

import userAccounts from './seed-data/user-accounts';
import userEmails from './seed-data/user-emails';
import userRoles from './seed-data/user-roles';

const prisma = new PrismaClient();

async function upsertUserAccounts(): Promise<Array<UserAccount>> {
  const keys = Object.keys(userAccounts);
  return Promise.all(
    keys.map((key) =>
      prisma.userAccount.upsert({
        where: { id: userAccounts[key].id },
        create: userAccounts[key],
        update: userAccounts[key],
      }),
    ),
  );
}

async function upsertUserEmails(): Promise<Array<UserEmail>> {
  return Promise.all(
    userEmails.map((data) => {
      return prisma.userEmail.upsert({
        where: { original: data.original },
        create: data,
        update: data,
      });
    }),
  );
}

async function upsertUserRoles(): Promise<Array<UserRole>> {
  return Promise.all(
    userRoles.map((data) =>
      prisma.userRole.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      }),
    ),
  );
}

async function seed(): Promise<void> {
  // User data needs to be seeded in this order: (1) roles; (2) accounts; (3) tokens; (4) emails
  const roles = await upsertUserRoles();
  console.log(`\n>> Upserted ${roles.length} user roles.`);

  const users = await upsertUserAccounts();
  console.log(`>> Upserted ${users.length} user accounts.`);

  const emails = await upsertUserEmails();
  console.log(`>> Upserted ${emails.length} email addresses.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
