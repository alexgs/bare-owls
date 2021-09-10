/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box, DataTable, Text } from 'grommet';
import * as React from 'react';

import { NavBar } from 'components';
import { PUBLIC } from 'lib';

interface QueryResult {
  users: UserRecordBase[];
}

interface UserRecordBase {
  displayName: string;
  id: string;
  role: {
    displayName: string;
    name: string;
  };
  username: string;
}

interface UserRecord extends UserRecordBase {
  linkStatus:
    | typeof PUBLIC.LOADING
    | typeof PUBLIC.AUTH_LINK.LINKED
    | typeof PUBLIC.AUTH_LINK.UNLINKED;
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
  {
    property: 'linkStatus',
    header: <Text>Link</Text>,
    render: renderLinkStatus,
  },
];

function renderLinkStatus(record: UserRecord): React.ReactNode {
  const status = record.linkStatus;
  if (status === PUBLIC.LOADING) {
    return <Text color={'grey'}>Loading...</Text>;
  } else if (status === PUBLIC.AUTH_LINK.LINKED) {
    return <Text color={'green'}>Linked</Text>;
  } else if (status === PUBLIC.AUTH_LINK.UNLINKED) {
    return <Text color={'purple'}>Unlinked</Text>;
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

function structureData(data?: QueryResult): UserDb {
  const output: UserDb = {};
  if (!data) {
    return output;
  }

  data.users.reduce((output, user) => {
    output[user.id] = {
      linkStatus: PUBLIC.LOADING,
      ...user,
    };
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
