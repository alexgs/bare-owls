/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Text } from 'grommet';
import * as React from 'react';

import { NavBar, UsersTable } from 'components';

const ControlIndex: React.FC = () => {
  return (
    <>
      <NavBar />
      <Box direction="column" flex>
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <UsersTable />
        </Box>
        <Box
          flex
          align="start"
          direction="column"
          justify="start"
          pad={{ left: 'medium' }}
        >
          <Text>
            Note that this <Text weight={'bold'}>ONLY</Text> shows if the user
            has been created in FusionAuth, <Text weight={'bold'}>NOT</Text>{' '}
            whether the user is registered in both the Core and CDN apps.
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default ControlIndex;
