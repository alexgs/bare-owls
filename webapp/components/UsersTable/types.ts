/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PUBLIC } from 'lib';

export interface Action {
  type: string;
  payload: unknown;
}

export interface InitPayload {
  data: QueryResult;
  dispatch: (action: Action) => void;
}

export type LinkStatus =
  | typeof PUBLIC.AUTH_LINK.LINKED
  | typeof PUBLIC.AUTH_LINK.UNLINKED
  | typeof PUBLIC.ERROR
  | typeof PUBLIC.LOADING;

export interface QueryResult {
  users: UserRecordBase[];
}

export interface UpdatePayload {
  linkStatus: LinkStatus;
  userId: string;
}

export type UserDb = Record<string, UserRecord>;

export interface UserRecord extends UserRecordBase {
  linkStatus: LinkStatus;
}

export interface UserRecordBase {
  displayName: string;
  id: string;
  role: {
    displayName: string;
    name: string;
  };
  username: string;
}
