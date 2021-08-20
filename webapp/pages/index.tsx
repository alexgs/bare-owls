/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';
import * as React from 'react';

import { NavBar } from 'components';

const Content: React.FC = () => {
  return <div>Hello world</div>;
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
