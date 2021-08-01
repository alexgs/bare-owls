/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';

import { JsonObject, Session } from 'types';

export const query = gql`
  query Session {
    session {
      account {
        displayName
        emails {
          original
        }
        id
        role {
          id
          name
        }
        username
      }
      data
      expires
      id
    }
  }
`;

export interface QueryResult {
  session: {
    account: {
      displayName: string;
      emails: Array<{
        original: string;
      }>;
      id: string;
      role: {
        id: string;
        name: string;
      };
      username: string;
    };
    data?: JsonObject;
    expires: string; // Datetime string
    id: string;
  };
}

interface SessionLoaderOutput {
  isError: boolean;
  isLoading: boolean;
  session: Session | null;
}

export function useSessionLoader(): SessionLoaderOutput {
  const { data, loading, error } = useQuery<QueryResult>(query, {
    pollInterval: 500,
  });
  const session: Session | null = data?.session
    ? {
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
      }
    : null;
  return {
    session,
    isError: !!error,
    isLoading: loading,
  };
}
