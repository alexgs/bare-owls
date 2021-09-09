/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const GRAPHQL_PATH = '/api/graphql';

const link = createHttpLink({
  credentials: 'same-origin',
  headers: {
    'X-Hasura-Admin-Secret': process.env.NEXT_PUBLIC_HASURA_SECRET,
  },
  uri: GRAPHQL_PATH,
});

export const apollo = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  uri: GRAPHQL_PATH,
});
