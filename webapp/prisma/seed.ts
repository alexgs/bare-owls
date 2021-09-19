/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import {
  Channel,
  ChannelSubscription,
  ChannelTier,
  PrismaClient,
  UserAccount,
  UserEmail,
  UserRole,
} from '@prisma/client';

import channelSubscriptions from './seed-data/channel-subscriptions';
import channelTiers from './seed-data/channel-tiers';
import channels from './seed-data/channels';
import userAccounts from './seed-data/user-accounts';
import userEmails from './seed-data/user-emails';
import userRoles from './seed-data/user-roles';

const prisma = new PrismaClient();

async function createChannelSubscriptions(): Promise<ChannelSubscription[]> {
  // Since this doesn't use `upsert`, there is a possibility of duplicated data,
  // but that should be prevented by the `UNIQUE` constraint on the table.
  return Promise.all(
    channelSubscriptions.map((data) => {
      return prisma.channelSubscription.create({ data });
    }),
  );
}

async function createChannelTiers(): Promise<ChannelTier[]> {
  // Since this doesn't use `upsert`, there is a possibility of duplicated data,
  // but that should be prevented by the `UNIQUE` constraint on the table.
  return Promise.all(
    channelTiers.map((data) => {
      return prisma.channelTier.create({ data });
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
  // (3) emails; (4) channels; (5) tiers; (6) subscriptions.
  const roles = await upsertUserRoles();
  console.log(`\n>> Upserted ${roles.length} user roles.`);

  const users = await upsertUserAccounts();
  console.log(`>> Upserted ${users.length} user accounts.`);

  const emails = await upsertUserEmails();
  console.log(`>> Upserted ${emails.length} email addresses.`);

  const channels = await upsertChannels();
  console.log(`>> Upserted ${channels.length} channels.`);

  const channelTiers = await createChannelTiers();
  console.log(`>> Created ${channelTiers.length} total channel tiers.`);

  const channelSubs = await createChannelSubscriptions();
  console.log(`>> Created ${channelSubs.length} total subscriptions.`);
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
