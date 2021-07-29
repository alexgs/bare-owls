/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Button } from 'grommet';
import { useRouter } from 'next/router';
import * as React from 'react';

import { NavBar } from 'components';
import { LOGIN_PATH, useSession } from 'lib';
import db from 'server-lib/prisma';

function Content() {
  const router = useRouter();
  const { isError, isLoading, session } = useSession();

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return null;
  }

  if (session) {
    return <div>Hello {session.user?.name}</div>;
  }

  return (
    <Button label="Login" onClick={() => router.push(LOGIN_PATH)} primary />
  );
}

const HomePage: React.FC = () => {
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

export const getServerSideProps = async () => {
  const posts = await db.userAccount.count();
  return { props: { posts } };
};

export default HomePage;
