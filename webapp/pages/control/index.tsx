/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client';
import { Box } from 'grommet';
import * as React from 'react';

import { NavBar, Protect } from 'components';
import { apollo } from 'lib';
import { Session } from 'types';

interface Props {}

const ControlIndex: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    // const client = ...

    void apollo
      .query({
        query: gql`
          query GetUsernames {
            users {
              username
            }
          }
        `,
      })
      .then((result) => console.log(result));
  }, []);

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
