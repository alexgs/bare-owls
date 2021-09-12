/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';

import { getConfig } from '../';

const { AUTH_API_KEY, AUTH_ORIGIN_INTERNAL } = getConfig();

export const server = got.extend({
  headers: {
    Authorization: AUTH_API_KEY,
  },
  prefixUrl: AUTH_ORIGIN_INTERNAL,
  responseType: 'json',
  throwHttpErrors: false,
});
