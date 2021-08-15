/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Button } from 'grommet';
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
  const [data, setData] = React.useState<Data>({ status: 0 });
  const router = useRouter();

  React.useEffect(() => {
    async function worker() {
      const response = await fetch('/api/session', { credentials: 'include' });
      const incomingData: Data = {
        status: response.status,
      }
      if (response.ok) {
        incomingData.payload = await response.json() as { displayName: string };
      }
      setData(incomingData);
    }
    void worker();
  }, []);

  let session = null;
  if (data) {
    session = data.status === 200 ? data.payload : null;
  }

  if (session) {
    return <div>Hello {session.displayName}</div>;
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

export default HomePage;
