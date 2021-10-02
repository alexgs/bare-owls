/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

var NAMESPACE = 'https://jwt-claims.owlbear.tech/';

function populate(jwt, user, registration) {
  jwt[NAMESPACE + 'subs'] = user.data.claims;
}
