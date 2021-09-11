/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box, Button, ColumnConfig, DataTable, Spinner, Text } from 'grommet';
import * as React from 'react';

import { NavBar } from 'components';
import { PUBLIC } from 'lib';

interface Action {
  type: string;
  payload: unknown;
}

interface InitPayload {
  data: QueryResult;
  dispatch: (action: Action) => void;
}

type LinkStatus =
  | typeof PUBLIC.AUTH_LINK.LINKED
  | typeof PUBLIC.AUTH_LINK.UNLINKED
  | typeof PUBLIC.ERROR
  | typeof PUBLIC.LOADING;

interface QueryResult {
  users: UserRecordBase[];
}

interface UpdateLinkStatusPayload {
  linkStatus: LinkStatus;
  userId: string;
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

const ACTIONS = {
  INIT: 'initialize-user-database',
  UPDATE: 'update-link-status',
} as const;

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

const initialState: UserDb = {};

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

function handleInitAction(payload: InitPayload): UserDb {
  const { data, dispatch } = payload;
  const userDb = structureData(data);
  const userIds = Object.keys(userDb);

  // Fetch link status in the background
  userIds.map(async (userId) => {
    if (userDb[userId].linkStatus === PUBLIC.LOADING) {
      const result = await getLinkStatus(userId);
      dispatch({
        type: ACTIONS.UPDATE,
        payload: {
          userId,
          linkStatus: result,
        },
      });
    }
  });

  return userDb;
}

function handleUpdateLinkStatusAction(
  payload: UpdateLinkStatusPayload,
  state: UserDb,
): UserDb {
  const { linkStatus, userId } = payload;
  return {
    ...state,
    [userId]: {
      ...state[userId],
      linkStatus,
    },
  };
}

function reducer(state: UserDb, action: Action): UserDb {
  switch (action.type) {
    case ACTIONS.INIT:
      return handleInitAction(action.payload as InitPayload);
    case ACTIONS.UPDATE:
      return handleUpdateLinkStatusAction(
        action.payload as UpdateLinkStatusPayload,
        state,
      );
    default:
      throw new Error(`Unknown action type "${action.type}"`);
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
