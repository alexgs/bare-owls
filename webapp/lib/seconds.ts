/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import ms from 'ms';

/**
 * Returns the number of whole seconds in the provided duration. Fractional
 * seconds, if any, will be discarded.
 */
export function seconds(duration: string): number {
  const milliseconds = ms(duration);
  return Math.floor(milliseconds / 1000);
}
