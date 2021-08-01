/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Button, Text } from 'grommet';
import { useRouter } from 'next/router';
import * as React from 'react';

import { LOGIN_PATH, useSessionLoader } from 'lib';

interface Props {
  children: React.ReactElement;
}

export const RequireLogin: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const { isError, isLoading, session } = useSessionLoader();

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return null;
  }

  if (session) {
    return props.children;
  }

  return (
    <Box>
      <Text>You must be logged in to view this page.</Text>
      <Button label="Login" onClick={() => router.push(LOGIN_PATH)} primary />
    </Box>
  );
};
