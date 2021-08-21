/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { nanoid } from 'nanoid';
import { NextApiRequest } from 'next';
import { Client, IdTokenClaims, Issuer } from 'openid-client';
import urlJoin from 'url-join';

import { Config, getConfig, prisma } from 'server-lib';
import { JsonObject, UserData } from 'types';

interface ClaimsHandlerOutput {
  user: UserData;
  data?: JsonObject;
}

// --- INTERNAL FUNCTIONS ---

/** @internal */
async function isRegistered(claims: IdTokenClaims): Promise<boolean> {
  const count = await prisma.userOpenIdToken.count({
    where: { sub: claims.sub },
  });
  if (count > 1) {
    throw new Error(`Found multiple tokens for subject "${claims.sub}".`);
  }
  return count === 1;
}

/**
 * @internal
 * @precondition prisma.userOpenIdToken.count({ where: { sub: claims.sub } }) === 1
 */
async function login(claims: IdTokenClaims): Promise<ClaimsHandlerOutput> {
  const accounts = await prisma.userAccount.findMany({
    where: {
      tokens: {
        some: { sub: claims.sub },
      },
    },
    include: {
      emails: {
        orderBy: { createdAt: 'asc' },
        take: 1,
      },
    },
  });

  if (accounts.length === 0) {
    throw new Error(`No account found for OIDC subject "${claims.sub}".`);
  }
  if (accounts.length > 1) {
    throw new Error(
      `Multiple accounts found for OIDC subject "${claims.sub}".`,
    );
  }

  const account = accounts[0];
  return {
    user: {
      id: account.id,
      name: account.displayName ?? account.username,
      email: account.emails[0].original,
    },
  };
}

/** @internal */
async function register(claims: IdTokenClaims): Promise<ClaimsHandlerOutput> {
  // TODO What if the account exists and the user is just using a new OIDC provider? Look for duplicate email addresses.
  const account = await prisma.userAccount.create({
    data: {
      id: nanoid(),
      displayName: claims.name,
      username: `new-user-${nanoid()}`,
      roleId: 'FAN',
    },
  });
  const email = await prisma.userEmail.create({
    data: {
      original: claims.email ?? 'invalid',
      simplified: claims.email ?? 'invalid',
      verified: claims.email_verified,
      accountId: account.id,
    },
  });
  const tokenId = await storeOpenIdToken(claims, account.id);
  return {
    user: {
      id: account.id,
      name: account.displayName ?? account.username,
      email: email.original,
    },
    data: {
      tokenId,
    },
  };
}

/** @internal */
async function storeOpenIdToken(
  claims: IdTokenClaims,
  accountId: string,
): Promise<string> {
  const aud = Array.isArray(claims.aud)
    ? JSON.stringify(claims.aud)
    : claims.aud;
  const token = await prisma.userOpenIdToken.create({
    data: {
      accountId,
      aud,
      id: nanoid(),
      sub: claims.sub,
      iss: claims.iss,
      exp: new Date(claims.exp * 1000),
      iat: new Date(claims.iat * 1000),
      email: claims.email,
      emailVerified: claims.email_verified,
      name: claims.name,
      nickname: claims.nickname,
    },
  });
  return token.id;
}

// --- PUBLIC FUNCTIONS ---

// export async function extractOpenIdToken(
//   req: NextApiRequest,
// ): Promise<IdTokenClaims> {
//   const nonce = req.cookies[COOKIE.NONCE];
//   if (!nonce) {
//     throw new Error('Unable to load nonce from cookie');
//   }
//
//   const client = await getOidcClient();
//   const params = client.callbackParams(req);
//   const tokens = await client.callback(CALLBACK_URL, params, { nonce });
//   return tokens.claims();
// }

export async function getOidcClient(): Promise<Client> {
  const config = getConfig();
  const {
    AUTH_ORIGIN_INTERNAL,
    AUTH_PATH_DISCOVERY,
    CALLBACK_URL,
    CLIENT_ID,
    CLIENT_SECRET,
  } = config;
  const discoveryUrl = urlJoin(AUTH_ORIGIN_INTERNAL, AUTH_PATH_DISCOVERY);
  const issuer = await Issuer.discover(discoveryUrl);
  return new issuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [CALLBACK_URL],
    response_types: ['code'],
  });
}

interface ResponseHandlerOutput {
  registerNewUser: boolean;
  sessionId: string;
}

// export async function handleOidcResponse(
//   req: NextApiRequest,
// ): Promise<ResponseHandlerOutput> {
//   const nonce = req.cookies[COOKIE.NONCE];
//   if (!nonce) {
//     throw new Error('Unable to load nonce from cookie');
//   }
//
//   const client = await getOidcClient();
//   const params = client.callbackParams(req);
//   const tokens = await client.callback(CALLBACK_URL, params, { nonce });
//   const claims = tokens.claims();
//
//   const isRegisteredSubject = await isRegistered(claims);
//   const { user, data } = isRegisteredSubject
//     ? await login(claims)
//     : await register(claims);
//   const sessionId = await startSession(user, data);
//   return {
//     sessionId,
//     registerNewUser: !isRegisteredSubject,
//   };
// }
