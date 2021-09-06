/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as React from 'react';
import useSWR from 'swr';
import { Fetcher } from 'swr/dist/types';

import { Session } from 'types';

interface Data {
  payload: NullableSession;
  status: number;
}

type NullableSession = Session | null;

type SessionProviderElement = React.FunctionComponentElement<
  React.ProviderProps<NullableSession>
>;

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionContext = React.createContext<NullableSession>(null);

const fetcher: Fetcher<Data> = async (path: string) => {
  const response = await fetch(path);
  if (response.status === 200) {
    const payload = await response.json() as { session: Session };
    return {
      payload: payload.session,
      status: response.status,
    };
  }
  return {
    payload: null,
    status: response.status,
  };
};

// This pattern was adapted from NextAuth v3.29.0
// https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/client/index.js
export function SessionProvider(
  props: SessionProviderProps,
): SessionProviderElement {
  const { children } = props;

  let session: NullableSession = null;
  const { data, error } = useSWR<Data, Error>('/api/session', fetcher);
  if (data) {
    session = data.status === 200 ? data.payload : null;
  } else {
    session = null;
  }
  if (error) {
    console.error(`SWR Error: ${error.message}`);
  }

  return React.createElement(
    SessionContext.Provider,
    { value: session },
    children,
  );
}

export function useSession(): NullableSession {
  return React.useContext(SessionContext);
}
