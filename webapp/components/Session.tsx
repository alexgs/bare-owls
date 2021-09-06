/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as React from 'react';

import { Session } from 'types';

type NullableSession = Session | null;

type SessionProviderElement = React.FunctionComponentElement<
  React.ProviderProps<NullableSession>
>;

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionContext = React.createContext<NullableSession>(null);

// This pattern was adapted from NextAuth v3.29.0
// https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/client/index.js
export function SessionProvider(
  props: SessionProviderProps,
): SessionProviderElement {
  const { children } = props;
  const session: NullableSession = null;
  // const session: NullableSession = {
  //   displayName: 'Fake',
  //   username: 'fake00',
  //   userId: '10101010101',
  //   lastName: 'McFakerson',
  //   firstName: 'Fakey',
  //   emailVerified: false,
  //   email: 'fakey@mcfakeperson.com',
  // };

  return React.createElement(
    SessionContext.Provider,
    { value: session },
    children,
  );
}

export function useSession(): NullableSession {
  return React.useContext(SessionContext);
}
