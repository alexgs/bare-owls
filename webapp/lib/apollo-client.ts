/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apollo = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});
