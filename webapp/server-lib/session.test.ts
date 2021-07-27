/* eslint-disable @typescript-eslint/unbound-method */
/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

jest.mock('./prisma');

import { UserData } from 'types';

import prisma from './prisma';
import { startSession } from './session';

describe('Server library function `getSession`', () => {
  it.todo('does something');
});

describe('Server library function `startSession`', () => {
  it('creates a record in the database', async () => {
    const user: UserData = {
      id: 'test-user',
      email: 'test@owlbear.tech',
      name: 'Testy Owlbear',
    };
    const data = { dummy: 'data' };
    const sessionId = await startSession(user, data);
    expect(prisma.session.create).toHaveBeenCalledTimes(1);
    // expect(prismaMock.session.create).toHaveBeenCalledWith();
  });

  it.todo('returns the session ID');
});
