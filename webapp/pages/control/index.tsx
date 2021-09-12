/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';
import * as React from 'react';

import { NavBar, UsersTable } from 'components';

const ControlIndex: React.FC = () => {
  return (
    <>
      <NavBar />
      <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <UsersTable />
        </Box>
      </Box>
    </>
  );
};

export default ControlIndex;
