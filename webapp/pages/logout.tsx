/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as cookie from 'cookie';
import { Box, Heading, Paragraph, Spinner } from 'grommet';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

import { NavBar } from 'components';
import { COOKIE, COOKIE_OPTIONS, getSession } from 'server-lib';

interface Props {
  sessionId: string | null;
}

const Logout: React.FC<Props> = (props: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    // TODO Call logout API
    // TODO Redirect to homepage
  }, []);

  return (
    <>
      <NavBar />
      <Box align="center" pad="medium" width={'100%'}>
        <Heading level={1} margin="none">
          Please wait...
        </Heading>
        <Box align="center" direction="row" gap="small" pad="small">
          <Spinner size={'medium'} />
        </Box>
        <Paragraph>You will be redirected momentarily.</Paragraph>
      </Box>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const session = await getSession(context.req);
  const sessionCookie = cookie.serialize(
    COOKIE.SESSION,
    '',
    COOKIE_OPTIONS.SESSION_RM,
  );
  context.res.setHeader('set-cookie', sessionCookie);
  return {
    props: { sessionId: session?.id ?? null }
  };
}


export default Logout;
