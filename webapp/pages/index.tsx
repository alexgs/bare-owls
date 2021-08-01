/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';
import * as React from 'react';

import { NavBar, RequireLogin } from 'components';
import { useSessionNew } from 'lib';

const Content: React.FC = () => {
  const session = useSessionNew();
  return <div>Hello {session.user?.name}</div>;
};

const HomePage: React.FC = () => {
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

export default HomePage;
