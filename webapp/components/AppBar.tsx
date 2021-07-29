/* eslint-disable react/no-children-prop */
/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';
import * as React from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const AppBar: React.FC<Props> = (props: Props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: 1 }}
    children={props.children}
  />
);
