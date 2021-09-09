/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloProvider } from '@apollo/client';
import { Grommet } from 'grommet';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';

import { SessionProvider } from 'components';
import { apollo } from 'lib';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const App = ({ Component, pageProps }: AppProps): React.ReactNode => {
  return (
    <>
      <Head>
        <title>Bare Owls</title>
      </Head>
      <SessionProvider>
        <Grommet theme={theme} full>
          <ApolloProvider client={apollo}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Grommet>
      </SessionProvider>
    </>
  );
};

export default App;
