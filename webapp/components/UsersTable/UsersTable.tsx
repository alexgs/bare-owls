/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box, Button, ColumnConfig, DataTable, Spinner, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import * as React from 'react';

import { PUBLIC } from 'lib';

import { ACTIONS, initialState, reducer } from './reducer';
import { Action, QueryResult, UserRecord } from './types';

const query = gql`
  query ListUsers {
    users {
      displayName
      emails {
        original
      }
      id
      role {
        displayName
        name
      }
      username
    }
  }
`;

export const UsersTable: React.FC = () => {
  const { data, error } = useQuery<QueryResult>(query);

  const [userDb, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (error) {
      console.error(error);
    }
    dispatch({
      type: ACTIONS.INIT,
      payload: { data, dispatch },
    });
  }, [data, error]);

  const COLUMNS: ColumnConfig<UserRecord>[] = [
    {
      property: 'username',
      header: <Text>Username</Text>,
    },
    {
      property: 'displayName',
      header: <Text>Display name</Text>,
    },
    {
      property: 'role.displayName',
      header: <Text>Role</Text>,
    },
    {
      property: 'linkStatus',
      align: 'center',
      header: <Text>Link</Text>,
      render: renderLinkStatus,
    },
  ];

  function handleCreateLinkClick(userId: string): void {
    dispatch({
      type: ACTIONS.CREATE,
      payload: {
        dispatch,
        userId,
      },
    });
  }

  function renderLinkStatus(record: UserRecord): React.ReactNode {
    const status = record.linkStatus;
    if (status === PUBLIC.LOADING) {
      return <Spinner size={'small'} />;
    } else if (status === PUBLIC.AUTH_LINK.LINKED) {
      return <StatusGood color={'brand'} />;
    } else if (status === PUBLIC.AUTH_LINK.UNLINKED) {
      return (
        <Button
          style={{ color: '#7D4CDB' }}
          size="small"
          label="CREATE LINK"
          onClick={() => handleCreateLinkClick(record.id)}
        />
      );
    } else {
      return <Text color={'red'}>Unknown error</Text>;
    }
  }

  return (
    <Box align={'center'}>
      <DataTable columns={COLUMNS} data={Object.values(userDb)} />
    </Box>
  );
};
