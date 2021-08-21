/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Button, Heading } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import { useRouter } from 'next/router';
import * as React from 'react';

import { LOGIN_PATH, LOGOUT_PATH } from 'lib';

import { AppBar } from './AppBar';

function LogInOutButton() {
  const router = useRouter();
  // const { isError, isLoading, session } = useSessionLoader();

  // if (isError) {
  //   console.error('Error loading session.');
  //   return null;
  // }
  //
  // if (isLoading) {
  //   return null;
  // }
  //
  // if (session) {
  //   return (
  //     <Button
  //       icon={<Logout />}
  //       onClick={() => {
  //         void router.push(LOGOUT_PATH);
  //       }}
  //     />
  //   );
  // }

  return (
    <Button
      icon={<Login />}
      onClick={() => {
        void router.push(LOGIN_PATH);
      }}
    />
  );
}

export const NavBar: React.FC = () => (
  <AppBar>
    <Heading level="3" margin="none">
      Bare Owls
    </Heading>
    <LogInOutButton />
  </AppBar>
);
