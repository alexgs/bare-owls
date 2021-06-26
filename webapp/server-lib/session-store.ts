/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Session } from 'server-lib/session';

// add store to the NodeJS global type
export interface StoreGlobal extends NodeJS.Global {
  store: Record<string, Session>
}

// Prevent multiple instances of session store in development
declare const global: StoreGlobal;

const store = global.store || {};

if (process.env.NODE_ENV === 'development') {
  global.store = store;
}

export default store;
