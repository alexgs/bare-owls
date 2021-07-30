/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { objectType } from 'nexus';

export const UserAccount = objectType({
  name: 'UserAccount',
  definition(t) {
    t.string('id');
    t.string('username');
  },
});

