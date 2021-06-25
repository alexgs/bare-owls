/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import { Issuer } from 'openid-client';

const BASE_URL = env.get('WEBAPP_BASE_URL').required().asString();
const CLIENT_ID = env.get('AUTH0_CLIENT_ID').required().asString();
const DOMAIN = env.get('AUTH0_DOMAIN').required().asString();

export async function getAuth0Client() {
  const issuer = await Issuer.discover(`https://${DOMAIN}/authorize`);
  return new issuer.Client({
    client_id: CLIENT_ID,
    redirect_uris: [`${BASE_URL}/callback`],
    response_types: ['id_token token'],
  });
}
