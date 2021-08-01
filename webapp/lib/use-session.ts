/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { useQuery } from '@apollo/client';
import useSWR from 'swr';
import { Fetcher } from 'swr/dist/types';

import { Session } from 'types';

import { query, QueryResult } from './use-session-loader';

interface Data {
  payload?: Session;
  status: number;
}

interface UseSessionOutput {
  isError: boolean;
  isLoading: boolean;
  session: Session | null;
}

const fetcher: Fetcher<Data> = async (path: string) => {
  const response = await fetch(path);
  if (response.status === 200) {
    const payload = (await response.json()) as Session;
    return {
      payload,
      status: response.status,
    };
  }
  return { status: response.status };
};

export function useSession(): UseSessionOutput {
  const { data, error } = useSWR<Data, Error>('/api/session', fetcher);
  let session = null;
  if (data) {
    session = data.status === 200 ? (data.payload as Session) : null;
  }
  return {
    session,
    isError: !!error,
    isLoading: !data && !error,
  };
}

export function useSessionNew(): Session {
  const { data } = useQuery<QueryResult>(query);
  if (!data) {
    throw new Error('Session not loaded.');
  }
  return {
    data: data.session.data,
    expires: new Date(data.session.expires),
    id: data.session.id,
    user: {
      id: data.session.account.id,
      name: data.session.account.displayName,
      email: data.session.account.emails[0].original,
      roleId: data.session.account.role.id,
      username: data.session.account.username,
    },
  };
}
