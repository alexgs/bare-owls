// noinspection JSUnusedGlobalSymbols

/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

const env = require('env-var');

const DOMAIN = env.get('AUTH0_DOMAIN').required().asString();

module.exports = {
  redirects: async () => [{
    source: '/login',
    destination: `https://${DOMAIN}/authorize`,
    permanent: false,
  }],
};
