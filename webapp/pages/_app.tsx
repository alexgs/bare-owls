/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloProvider } from '@apollo/client'
import { Grommet } from 'grommet';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';

import { useApollo } from 'lib/apollo';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

interface ApolloAppProps extends AppProps {
  pageProps: PageProps;
}

interface PageProps extends JSX.IntrinsicAttributes {
  initialApolloState: Record<string, unknown>;
}

const App = ({ Component, pageProps }: ApolloAppProps): React.ReactNode => {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <>
      <Head>
        <title>Bare Owls</title>
      </Head>
      <Grommet theme={theme} full>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Grommet>
    </>
  );
};

export default App;
