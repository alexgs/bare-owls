/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { DateTimeResolver, JSONResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export * from './Query';
export * from './Session';
export * from './Users';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');
export const GQLJson = asNexusMethod(JSONResolver, 'json');
