/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import * as React from 'react';

import { NavBar, useSession } from 'components';
import { STATUS, getAccessToken, getSession } from 'server-lib';
import { Session } from 'types';

interface Props {
  session: Session | null;
}

const Content: React.FC<Props> = (props: Props) => {
  if (props.session) {
    return <div>Hello {props.session.displayName}!</div>
  }
  return <div>Hello world</div>;
};

const HomePage: React.FC = () => {
  const session = useSession();
  return (
    <>
      <NavBar />
      <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <Content session={session} />
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await getAccessToken(
    context.req as NextApiRequest,
    context.res as NextApiResponse,
  );
  if (result.status === STATUS.OK) {
    const session = await getSession(result.token);
    return { props: { session } };
  }
  return { props: { session: null } };
};

export default HomePage;
