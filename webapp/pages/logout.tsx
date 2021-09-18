/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Button, Heading, Text } from 'grommet';
import * as React from 'react';

import { NavBar } from 'components';

const Logout: React.FC = () => {
  return (
    <>
      <NavBar />
      <Box flex align="center" pad="medium" width="100%">
        <Heading level={1} margin="none">
          Goodbye!
        </Heading>
        <Box width={'75%'}>
          <Text
            alignSelf={'center'}
            margin={{ bottom: 'medium', top: 'medium' }}
          >
            Parting is such sweet sorrow.
          </Text>
          <Text alignSelf={'center'} margin={{ bottom: 'medium' }}>
            We hope to see you again soon.
          </Text>
          <Text alignSelf={'center'}>
            Do you want to logout on this device only, or on all of your
            devices?
          </Text>
          <Box direction="row" gap="medium" margin={{ top: 'large' }}>
            <Button label="Cancel" />
            <Button
              label="All devices"
              tip={'Logout of all devices.'}
              margin={{ left: 'auto' }}
            />
            <Button
              label="Logout"
              tip={'Logout of this device only.'}
              primary
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Logout;
