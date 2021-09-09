/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box, DataTable, Text } from 'grommet';
import * as React from 'react';

import { NavBar } from 'components';

interface QueryResult {
  users: UserRecord[];
}

interface UserRecord {
  displayName: string;
  id: string;
  role: {
    displayName: string;
    name: string;
  };
  username: string;
}

type UserDb = Record<string, UserRecord>;

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
    property: 'role.displayName',
    header: <Text>Role</Text>,
  },
];

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

function structureData(data?: QueryResult): UserDb {
  const output: UserDb = {};
  if (!data) {
    return output;
  }

  data.users.reduce((output, user) => {
    output[user.id] = user;
    return output;
  }, output);
  return output;
}

const Content: React.FC = () => {
  const { data, error } = useQuery<QueryResult>(query);

  const [userDb, setUserDb] = React.useState<UserDb>({});

  React.useEffect(() => {
    if (error) {
      console.error(error);
    }

    if (data) {
      console.log(data);
    }

    setUserDb(structureData(data));
  }, [data, error]);

  return (
    <Box align={'center'}>
      <DataTable columns={columns} data={Object.values(userDb)} />
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
