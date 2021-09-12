/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export const PATHS = {
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const;

// Status messages for public (i.e. REST) API calls; see /webapp/server-lib/constants for private status messages
export const PUBLIC = {
  AUTH_LINK: {
    LINKED: 'status.public-api.auth-link.linked',
    UNLINKED: 'status.public-api.auth-link.unlinked',
  },
  ERROR: 'status.public-api.error',
  LOADING: 'status.public-api.loading',
} as const;
export const LOGIN_PATH = '/login';
export const LOGOUT_PATH = '/logout';
