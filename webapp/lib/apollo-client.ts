/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// We need to load a Fetch polyfill on the server when we run the `npm run gen:nexus` script
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  require('cross-fetch/polyfill');
}

const GRAPHQL_PATH = '/api/graphql';

const link = createHttpLink({
  credentials: 'same-origin',
  uri: GRAPHQL_PATH,
});

export const apollo = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  uri: GRAPHQL_PATH,
});
