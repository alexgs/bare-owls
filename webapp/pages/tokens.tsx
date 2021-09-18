/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import * as React from 'react';

import { NavBar } from 'components';
import { PRIVATE, auth, getAccessToken, getSession } from 'server-lib';
import { Session } from 'types';

interface Props {
  session: Session | null;
  tokens: Record<string, unknown>[] | null;
}

const Content: React.FC<Props> = (props: Props) => {
  if (props.session) {
    const json = JSON.stringify(props.tokens, null, 2);
    return <pre>{json}</pre>;
  }
  return <div>You must be logged in!</div>;
};

const HomePage: React.FC<Props> = (props: Props) => {
  const { session, tokens } = props;
  return (
    <>
      <NavBar />
      <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <Content session={session} tokens={tokens} />
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokenResult = await getAccessToken(
    context.req as NextApiRequest,
    context.res as NextApiResponse,
  );
  if (accessTokenResult.status !== PRIVATE.OK) {
    return {
      props: {
        session: null,
        tokens: null,
      },
    };
  }

  const session = await getSession(accessTokenResult.token);
  const refreshTokenResult = await auth.getRefreshTokens(
    accessTokenResult.token,
  );
  const tokens =
    refreshTokenResult.status === 'ok' ? refreshTokenResult.tokens : null;
  return { props: { session, tokens } };
};

export default HomePage;
