/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { server } from 'server-lib/auth-client/auth-server';

interface JsonWebToken {
  applicationId: string;
  exp: number;
  iat: number;
  iss: string;
  roles: string[];
  sub: string;
}

interface ResponseBody {
  jwt: JsonWebToken;
}

type ValidateJwtResult = ValidateJwtResultFailure | ValidateJwtResultSuccess;

interface ValidateJwtResultFailure {
  isValid: false;
}

interface ValidateJwtResultSuccess {
  isValid: true;
  jwt: JsonWebToken;
}

export async function validateJwt(jwt: string): Promise<ValidateJwtResult> {
  const response = await server.get<ResponseBody>('api/jwt/validate', {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (response.statusCode === 200 && response.body.jwt) {
    return {
      isValid: true,
      jwt: response.body.jwt,
    };
  } else {
    return { isValid: false };
  }
}
