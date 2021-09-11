/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PUBLIC } from 'lib';

import {
  Action,
  InitPayload,
  LinkStatus,
  QueryResult,
  UpdatePayload,
  UserDb,
} from './types';

// --- HELPER FUNCTIONS ---

async function getLinkStatus(userId: string): Promise<LinkStatus> {
  const url = `/api/users/${userId}/link`;
  const response = await fetch(url);
  if (response.ok) {
    const json = (await response.json()) as { linkStatus?: LinkStatus };
    return json.linkStatus ?? PUBLIC.AUTH_LINK.LINKED;
  } else {
    return PUBLIC.ERROR;
  }
}

function structureData(data?: QueryResult): UserDb {
  const output: UserDb = {};
  if (!data) {
    return output;
  }
  data.users.reduce((output, user) => {
    output[user.id] = {
      linkStatus: PUBLIC.LOADING,
      ...user,
    };
    return output;
  }, output);
  return output;
}

// --- ACTION HANDLERS ---

function handleInitAction(payload: InitPayload): UserDb {
  const { data, dispatch } = payload;
  const userDb = structureData(data);
  const userIds = Object.keys(userDb);

  // Fetch link status in the background
  userIds.map(async (userId) => {
    if (userDb[userId].linkStatus === PUBLIC.LOADING) {
      const result = await getLinkStatus(userId);
      dispatch({
        type: ACTIONS.UPDATE,
        payload: {
          userId,
          linkStatus: result,
        },
      });
    }
  });

  return userDb;
}

function handleUpdateAction(payload: UpdatePayload, state: UserDb): UserDb {
  const { linkStatus, userId } = payload;
  return {
    ...state,
    [userId]: {
      ...state[userId],
      linkStatus,
    },
  };
}

// --- EXPORTS ---

export const ACTIONS = {
  INIT: 'initialize-user-database',
  UPDATE: 'update-link-status',
} as const;

export const initialState: UserDb = {};

export function reducer(state: UserDb, action: Action): UserDb {
  switch (action.type) {
    case ACTIONS.INIT:
      return handleInitAction(action.payload as InitPayload);
    case ACTIONS.UPDATE:
      return handleUpdateAction(action.payload as UpdatePayload, state);
    default:
      throw new Error(`Unknown action type "${action.type}"`);
  }
}
