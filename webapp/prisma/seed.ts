/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client';

import userRoles from './seed-data/user-roles';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  const keys = Object.keys(userRoles);
  const roles = await Promise.all(
    keys.map((key) =>
      prisma.userRole.upsert({
        where: { id: key },
        create: userRoles[key],
        update: userRoles[key],
      }),
    ),
  );
  console.log(`>> Upserted ${roles.length} roles.`);
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
