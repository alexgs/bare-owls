/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Session } from './auth';

export interface ApolloContext {
  session: Session | null;
}
