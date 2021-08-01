/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box } from 'grommet';
import * as React from 'react';

import { NavBar, RequireLogin } from 'components';
import { useSession } from 'lib';

const usernamesQuery = gql`
  query GetUsernames {
    users {
      username
    }
  }
`;

interface QueryResult {
  users: Array<{username: string}>;
}

interface Props {}

const Content: React.FC = () => {
  const session = useSession();
  return <div>Session ID: {session.id}</div>
}

const ControlIndex: React.FC<Props> = (props: Props) => {
  const { data, loading, error } = useQuery<QueryResult>(usernamesQuery);

  if (error) {
    console.error(error);
  }

  if (data) {
    console.log(data);
  }

  return (
    <>
      <NavBar />
      <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <RequireLogin>
            <Content />
          </RequireLogin>
        </Box>
      </Box>
    </>
  );
};

export default ControlIndex;
