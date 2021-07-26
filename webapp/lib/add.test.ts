/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { add } from './add';

test('correctly adds 2 and 2', () => {
  expect(add(2, 2)).toEqual(4);
});
