/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

// I'm not sure how this is different than the STATUS struct in
// `server-lib/constants`... :shrug: Except that these codes are returned from
// REST endpoints and the others are used for function APIs.
export const STATE = {
  AUTH_LINK: {
    LINKED: 'state.auth-link.linked',
    UNLINKED: 'state.auth-link.unlinked',
  },
  ERROR: 'state.error',
  LOADING: 'state.loading',
} as const;
export const LOGIN_PATH = '/login';
export const LOGOUT_PATH = '/logout';
