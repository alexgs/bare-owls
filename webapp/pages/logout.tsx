/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box, Button, Heading, Text } from 'grommet';
import { useRouter } from 'next/router';
import * as React from 'react';

import { NavBar } from 'components';

const Logout: React.FC = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const router = useRouter();

  async function handleAllDevicesClick() {
    await handleApiCall(true);
  }

  async function handleApiCall(global: boolean) {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ global }),
    });

    if (response.status >= 500 && response.status < 600) {
      setErrorMessage(
        'Something went wrong on the server. Please try again later.',
      );
    } else {
      // If the logout was successful or the request was malformed, redirect to homepage
      await router.push('/');
    }
  }

  async function handleCancelClick() {
    await router.push('/');
  }

  async function handleLogoutClick() {
    await handleApiCall(false);
  }

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
          <Text alignSelf={'center'} color="status-error" margin="small">
            {errorMessage}
          </Text>
          <Text alignSelf={'center'}>
            Do you want to logout on this device only, or on all of your
            devices?
          </Text>
          <Box direction="row" gap="medium" margin={{ top: 'large' }}>
            <Button label="Cancel" onClick={handleCancelClick} />
            <Button
              label="All devices"
              margin={{ left: 'auto' }}
              onClick={handleAllDevicesClick}
              tip={'Logout of all devices.'}
            />
            <Button
              primary
              label="Logout"
              onClick={handleLogoutClick}
              tip={'Logout of this device only.'}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Logout;
