/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import {
  Channel,
  ChannelSubscription,
  PrismaClient,
  UserAccount,
  UserEmail,
  UserRole,
} from '@prisma/client';

import channels from './seed-data/channels';
import channelSubscriptions from './seed-data/channel-subscriptions';
import userAccounts from './seed-data/user-accounts';
import userEmails from './seed-data/user-emails';
import userRoles from './seed-data/user-roles';

const prisma = new PrismaClient();

async function createChannelSubscriptions(): Promise<ChannelSubscription[]> {
  // Since this doesn't use `upsert`, there is a possibility of duplicated data
  return Promise.all(
    channelSubscriptions.map((data) => {
      return prisma.channelSubscription.create({ data });
    }),
  );
}

async function upsertChannels(): Promise<Channel[]> {
  return Promise.all(
    channels.map((data) => {
      return prisma.channel.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      });
    }),
  );
}

async function upsertUserAccounts(): Promise<UserAccount[]> {
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

async function upsertUserEmails(): Promise<UserEmail[]> {
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

async function upsertUserRoles(): Promise<UserRole[]> {
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
  // Application data needs to be seeded in this order: (1) roles; (2) accounts;
  // (3) emails; (4) channels; (5) subscriptions.
  const roles = await upsertUserRoles();
  console.log(`\n>> Upserted ${roles.length} user roles.`);

  const users = await upsertUserAccounts();
  console.log(`>> Upserted ${users.length} user accounts.`);

  const emails = await upsertUserEmails();
  console.log(`>> Upserted ${emails.length} email addresses.`);

  const channels = await upsertChannels();
  console.log(`>> Upserted ${channels.length} channels.`);

  const channelSubs = await createChannelSubscriptions();
  console.log(`>> Created ${channelSubs.length} subscriptions.`);
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
