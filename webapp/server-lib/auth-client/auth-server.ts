/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import got from 'got';

import { getConfig } from '../config';

const { AUTH_ORIGIN_INTERNAL, WEBAPP_AUTH_API_KEY } = getConfig();

export const server = got.extend({
  headers: {
    Authorization: WEBAPP_AUTH_API_KEY,
  },
  prefixUrl: AUTH_ORIGIN_INTERNAL,
  responseType: 'json',
  throwHttpErrors: false,
});
