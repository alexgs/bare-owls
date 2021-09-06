/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Grommet } from 'grommet';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';

import { SessionProvider } from 'components';
import { Session } from 'types';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const session: Session = {
  displayName: 'Fake',
  username: 'fake00',
  userId: '10101010101',
  lastName: 'McFakerson',
  firstName: 'Fakey',
  emailVerified: false,
  email: 'fakey@mcfakeperson.com',
};

const App = ({ Component, pageProps }: AppProps): React.ReactNode => {
  return (
    <>
      <Head>
        <title>Bare Owls</title>
      </Head>
      <SessionProvider.Provider value={session}>
        <Grommet theme={theme} full>
          <Component {...pageProps} />
        </Grommet>
      </SessionProvider.Provider>
    </>
  );
};

export default App;
