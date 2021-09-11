/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box, Button, ColumnConfig, DataTable, Spinner, Text } from 'grommet';
import * as React from 'react';

import { PUBLIC } from 'lib';

import { ACTIONS, initialState, reducer } from './reducer';
import { QueryResult, UserRecord } from './types';

const columns: ColumnConfig<UserRecord>[] = [
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

function renderLinkStatus(record: UserRecord): React.ReactNode {
  const status = record.linkStatus;
  if (status === PUBLIC.LOADING) {
    return <Spinner size={'small'} />;
  } else if (status === PUBLIC.AUTH_LINK.LINKED) {
    return <Text color={'green'}>Linked</Text>;
  } else if (status === PUBLIC.AUTH_LINK.UNLINKED) {
    return <Button size="small" label="CREATE LINK" />;
  } else {
    return <Text color={'red'}>Unknown error</Text>;
  }
}

const query = gql`
  query ListUsers {
    users {
      displayName
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

  return (
    <Box align={'center'}>
      <DataTable columns={columns} data={Object.values(userDb)} />
    </Box>
  );
};
