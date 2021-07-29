/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Heading } from 'grommet';
import * as React from 'react';

import { AppBar } from './AppBar';

export const NavBar: React.FC = () => (
  <AppBar>
    <Heading level="3" margin="none">
      Bare Owls
    </Heading>
  </AppBar>
);
