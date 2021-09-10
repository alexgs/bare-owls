/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box, Button, ColumnConfig, DataTable, Spinner, Text } from 'grommet';
import * as React from 'react';

import { NavBar } from 'components';
import { PUBLIC } from 'lib';

type LinkStatus =
  | typeof PUBLIC.AUTH_LINK.LINKED
  | typeof PUBLIC.AUTH_LINK.UNLINKED
  | typeof PUBLIC.ERROR
  | typeof PUBLIC.LOADING;

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
  linkStatus: LinkStatus;
}

type UserDb = Record<string, UserRecord>;

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

async function getLinkStatus(userId: string): Promise<LinkStatus> {
  const url = `https://localhost.owlbear.tech/api/users/${userId}/link`;
  const response = await fetch(url);
  if (response.ok) {
    const json = (await response.json()) as { linkStatus?: LinkStatus };
    return json.linkStatus ?? PUBLIC.AUTH_LINK.LINKED;
  } else {
    return PUBLIC.ERROR;
  }
}

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

  React.useEffect(() => {
    const userIds = Object.keys(userDb);
    if (userIds.length === 0) {
      return;
    }
    const userId = userIds[0];

    async function worker() {
      const result = await getLinkStatus(userId);
      const newDb = { ...userDb };
      newDb[userId] = {
        ...newDb[userId],
        linkStatus: result,
      };
      setUserDb(newDb);
    }

    if (userDb[userId].linkStatus === PUBLIC.LOADING) {
      void worker();
    }
  }, [userDb]);

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
