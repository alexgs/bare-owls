/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { seconds } from './seconds';

describe('Library function `session`', () => {
  it('returns the number of seconds in "2m"', () => {
    const result = seconds('2m');
    expect(result).toEqual(120);
  });

  it('returns the number of seconds in "1h"', () => {
    const result = seconds('1h');
    expect(result).toEqual(60 * 60);
  });

  it('drops any partial seconds', () => {
    const result = seconds('1.5s');
    expect(result).toEqual(1);
  });
});
