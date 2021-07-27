/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Heading, Paragraph, Spinner } from 'grommet';
import { useRouter } from 'next/router';
import * as queryString from 'query-string';
import * as React from 'react';

import { AppBar } from 'components';

const Callback: React.FC = () => {
  const router = useRouter();

  React.useEffect(
    () => {
      const query = queryString.parse(window.location.search);
      const path = query?.newUser ? '/register' : '/';
      setTimeout(() => {
        void router.push(path);
      }, 250);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <AppBar>
        <Heading level="3" margin="none">
          Bare Owls
        </Heading>
      </AppBar>

      <Box align="center" pad="medium" width={'100%'}>
        <Heading level={1} margin="none">
          Please wait...
        </Heading>
        <Box align="center" direction="row" gap="small" pad="small">
          <Spinner size={'medium'} />
        </Box>
        <Paragraph>You will be redirected momentarily.</Paragraph>
      </Box>
    </>
  );
};

export default Callback;
