/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box, DataTable, Text } from 'grommet';
import * as React from 'react';

import { NavBar } from 'components';

const query = gql`
  query ListUsers {
    users {
      displayName
      id
      role {
        id
        name
      }
      username
    }
  }
`;

interface QueryResult {
  users: Array<{
    displayName: string;
    id: string;
    role: {
      id: string;
      name: string;
    };
    username: string;
  }>;
}

const columns = [
  {
    property: 'username',
    header: <Text>Username</Text>,
  },
  {
    property: 'displayName',
    header: <Text>Display name</Text>,
  },
  {
    property: 'role.name',
    header: <Text>Role</Text>,
  },
];

const Content: React.FC = () => {
  const { data, error } = useQuery<QueryResult>(query);

  if (error) {
    console.error(error);
  }

  if (data) {
    console.log(data);
  }

  return (
    <Box align={'center'}>
      <DataTable columns={columns} data={data?.users} />
    </Box>
  );
};

const ControlIndex: React.FC = () => {
  return (
    <>
      <NavBar />
      <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <Content />
        </Box>
      </Box>
    </>
  );
};

export default ControlIndex;
