/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as React from 'react';

import { Session } from 'types';

const session: Session = {
  displayName: 'Fake',
  username: 'fake00',
  userId: '10101010101',
  lastName: 'McFakerson',
  firstName: 'Fakey',
  emailVerified: false,
  email: 'fakey@mcfakeperson.com',
};

export const SessionProvider = React.createContext(session);

export function useSession(): Session {
  return React.useContext(SessionProvider);
}
