/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { format } from 'date-fns';
import { Box, DataTable, Text } from 'grommet';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import * as React from 'react';

import { NavBar } from 'components';
import { PRIVATE, auth, getAccessToken, getSession } from 'server-lib';
import { RefreshTokenData } from 'server-lib/auth-client';
import { Session } from 'types';

function formatInstant(instant: number) {
  const date = format(instant, 'yyyy-MM-dd');
  const time = format(instant, 'kk:mm:ss');
  return date + ' ' + time;
}

const COLUMNS = [
  {
    property: 'id',
    header: <Text>ID</Text>,
  },
  {
    property: 'createdAt',
    header: <Text>Created</Text>,
  },
  {
    property: 'lastUsedAt',
    header: <Text>Last used</Text>,
  },
];

interface Props {
  session: Session | null;
  tokens: RefreshTokenData[] | null;
}

const Content: React.FC<Props> = (props: Props) => {
  if (props.session) {
    const data = props.tokens
      ?.sort((a, b) => b.metaData.device.lastAccessedInstant - a.metaData.device.lastAccessedInstant)
      .map(token => {
        return {
          id: token.id.substr(0, 8),
          lastUsedAt: formatInstant(token.metaData.device.lastAccessedInstant),
          createdAt: formatInstant(token.insertInstant),
        };
      });
    return <DataTable columns={COLUMNS} data={data} />;
  }
  return <div>You must be logged in!</div>;
};

const Tokens: React.FC<Props> = (props: Props) => {
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

export default Tokens;
