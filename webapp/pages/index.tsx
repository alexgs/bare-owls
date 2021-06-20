/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Button, Heading } from 'grommet';
import { Notification } from 'grommet-icons';

const AppBar = (props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: '1' }}
    {...props}
  />
);

function HomePage() {
  return (
    <Box fill>
      <AppBar>
        <Heading level='3' margin='none'>My App</Heading>
        <Button icon={<Notification />} onClick={() => {}} />
      </AppBar>
      <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
        <Box flex align='center' justify='center'>
          Welcome to Next.js!
        </Box>
        <Box
          width='medium'
          background='light-2'
          elevation='small'
          align='center'
          justify='center'
        >
          sidebar
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
