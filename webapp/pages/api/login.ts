/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { getAuth0Client } from '../../lib/oidc';

export default async function handler(request, response) {
  const client = await getAuth0Client();
  const url = client.authorizationUrl({
    scope: 'openid email profile',
    response_mode: 'form_post',
  });
  response.redirect(302, url);
}
