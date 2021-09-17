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
  displayName: string;
  email: string;
  emailVerified: boolean;
  userId: string;
  username: string
}

// https://fusionauth.io/docs/v1/tech/oauth/endpoints/#userinfo
export interface UserinfoResponse {
  applicationId: string;
  birthdate?: string;
  email: string;
  email_verified: boolean;
  family_name?: string;
  given_name?: string;
  name?: string;
  middle_name?: string;
  phone_number?: string;
  picture?: string;
  preferred_username: string; // This is not in the API docs, but it is on the actual response :shrug:
  roles: string[];
  sub: string;
}
