/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PUBLIC } from 'lib';

import {
  Action,
  CreatePayload,
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

function handleCreateAction(payload: CreatePayload, state: UserDb): UserDb {
  const { dispatch, userId } = payload;

  const user = state[userId];
  const data = {
    email: user.emails[0].original,
    displayName: user.displayName,
    password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD,
    username: user.username,
  };

  async function createActionThunk() {
    const url = `/api/users/${userId}/link`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let linkStatus: LinkStatus = PUBLIC.LOADING;
    if (response.ok) {
      const json = (await response.json()) as { linkStatus?: LinkStatus };
      linkStatus = json.linkStatus ?? PUBLIC.ERROR;
    } else {
      linkStatus = PUBLIC.ERROR;
    }
    dispatch({
      type: ACTIONS.UPDATE,
      payload: {
        linkStatus,
        userId,
      },
    });

  }

  // Do the REST request in the background
  void createActionThunk();

  return {
    ...state,
    [userId]: {
      ...state[userId],
      linkStatus: PUBLIC.LOADING,
    },
  };
}

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
  CREATE: 'create-auth-link',
  INIT: 'initialize-user-database',
  UPDATE: 'update-link-status',
} as const;

export const initialState: UserDb = {};

export function reducer(state: UserDb, action: Action): UserDb {
  switch (action.type) {
    case ACTIONS.CREATE:
      return handleCreateAction(action.payload as CreatePayload, state);
    case ACTIONS.INIT:
      return handleInitAction(action.payload as InitPayload);
    case ACTIONS.UPDATE:
      return handleUpdateAction(action.payload as UpdatePayload, state);
    default:
      throw new Error(`Unknown action type "${action.type}"`);
  }
}
