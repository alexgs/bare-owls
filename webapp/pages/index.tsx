/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Button } from 'grommet';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import * as React from 'react';

import { NavBar } from 'components';
import { LOGIN_PATH } from 'lib';

interface Data {
  payload?: {
    displayName: string;
  };
  status: number;
}

const Content: React.FC = () => {
  const [session, loading] = useSession();

  if (!session) {
    return <Button label="Login" onClick={() => signIn()} primary />;
  }

  if (session) {
    return (
      <>
        <div>Hello {session.displayName}</div>
        <Button label="Login" onClick={() => signOut()} primary />
      </>
    );
  }

  return null;
};

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

export default HomePage;
