/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { useQuery } from '@apollo/client';

import { Session } from 'types';

import { query, QueryResult } from './use-session-loader';

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
