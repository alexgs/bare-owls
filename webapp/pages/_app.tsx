/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Grommet } from 'grommet';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';

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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <title>Bare Owls</title>
      </Head>
      <Grommet theme={theme}>
        <Component {...pageProps} />
      </Grommet>
    </>
  );
};

export default App;
