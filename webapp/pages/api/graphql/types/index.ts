/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export * from './Query';
export * from './Users';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');
