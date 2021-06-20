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
    <>
      <AppBar>
        <Heading level='3' margin='none'>My App</Heading>
        <Button icon={<Notification />} onClick={() => {}} />
      </AppBar>
      <div>Welcome to Next.js!</div>
    </>
  );
}

export default HomePage;
