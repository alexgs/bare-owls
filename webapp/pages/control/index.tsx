/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { gql, useQuery } from '@apollo/client';
import { Box } from 'grommet';
import * as React from 'react';

import { NavBar, Protect } from 'components';
import { Session } from 'types';

const usernamesQuery = gql`
  query GetUsernames {
    users {
      username
    }
  }
`;

interface Props {}

const ControlIndex: React.FC<Props> = (props: Props) => {
  const { data, loading, error } = useQuery(usernamesQuery);

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
          <Protect>{(session: Session) => <div>Hello control</div>}</Protect>
        </Box>
      </Box>
    </>
  );
};

export default ControlIndex;
