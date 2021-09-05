/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export interface FusionAuthClaims {
  aud: string;
  authenticationType: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  sub: string;
}

export interface Session {
  firstName: string;
  lastName?: string;
  displayName: string;
  username: string
  email: string;
  emailVerified: boolean;
  userId: string;
}
