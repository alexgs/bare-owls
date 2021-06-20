/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';

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
      <AppBar>Hello Grommet!</AppBar>
      <div>Welcome to Next.js!</div>
    </>
  );
}

export default HomePage;
