/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient, UserAccount, UserRole } from '@prisma/client';

import userAccounts from './seed-data/user-accounts';
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

async function upsertUserRoles(): Promise<Array<UserRole>> {
  const keys = Object.keys(userRoles);
  return Promise.all(
    keys.map((key) =>
      prisma.userRole.upsert({
        where: { id: key },
        create: userRoles[key],
        update: userRoles[key],
      }),
    ),
  );
}

async function seed(): Promise<void> {
  const roles = await upsertUserRoles();
  console.log(`\n>> Upserted ${roles.length} user roles.`);

  const users = await upsertUserAccounts();
  console.log(`>> Upserted ${users.length} user accounts.`);
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
