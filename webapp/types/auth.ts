/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export interface Session {
  user?: UserData;
  expires: Date;
}

export type SessionId = string;

export interface UserData {
  email: string;
  id: string;
  name: string;
}

