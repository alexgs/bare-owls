/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { SealOptions } from '@hapi/iron';
import * as cookie from 'cookie';
import * as env from 'env-var';
import ms from 'ms';
import { nanoid } from 'nanoid';
import { NextApiRequest } from 'next';
import { Client, IdTokenClaims, Issuer } from 'openid-client';

import { seconds } from 'lib';
import { prisma } from 'server-lib';
import { JsonObject, UserData } from 'types';

import { startSession } from './session';

interface ClaimsHandlerOutput {
  user: UserData;
  data?: JsonObject;
}

type CookieOptionsSet = Record<string, cookie.CookieSerializeOptions>;

interface IronPassword {
  id: string;
  secret: string;
}

type IronPasswords = Array<IronPassword>;

interface SealPassword {
  id: string;
  secret: string;
}

const BASE_URL = env.get('WEBAPP_BASE_URL').required().asString();
const CLIENT_ID = env.get('AUTH0_CLIENT_ID').required().asString();
const COOKIE_NONCE_TTL = env.get('COOKIE_NONCE_TTL').required().asString();
const COOKIE_SESSION_TTL = env.get('COOKIE_SESSION_TTL').required().asString();
const DOMAIN = env.get('AUTH0_DOMAIN').required().asString();
const IRON_CURRENT_PWD = env.get('IRON_CURRENT_PWD').required().asString();
const IRON_PASSWORDS = env
  .get('IRON_PASSWORDS')
  .required()
  .asJsonArray() as IronPasswords;
const IRON_SEAL_TTL = env.get('COOKIE_SESSION_TTL').required().asString();

export const CALLBACK_URL = `${BASE_URL}/api/callback`;
export const COOKIE = {
  SESSION: 'iron-owl',
  NONCE: 'bare-owls-nonce',
};
export const COOKIE_OPTIONS: CookieOptionsSet = {
  NONCE_RM: {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
    sameSite: 'none', // This should match NONCE_SET.sameSite
    secure: true,
  },
  NONCE_SET: {
    httpOnly: true,
    maxAge: seconds(COOKIE_NONCE_TTL),
    path: '/',
    sameSite: 'none',
    secure: true,
  },
  SESSION_RM: {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
    sameSite: 'strict', // This should match SESSION_SET.sameSite
    secure: true,
  },
  SESSION_SET: {
    httpOnly: true,
    maxAge: seconds(COOKIE_SESSION_TTL),
    path: '/',
    sameSite: 'strict', // This might need to be "lax"
    secure: true,
  },
};
// noinspection SpellCheckingInspection
export const IRON_OPTIONS: SealOptions = {
  // Same as the default options except for `ttl`
  encryption: {
    saltBits: 256,
    algorithm: 'aes-256-cbc',
    iterations: 1,
    minPasswordlength: 32,
  },
  integrity: {
    saltBits: 256,
    algorithm: 'sha256',
    iterations: 1,
    minPasswordlength: 32,
  },
  ttl: ms(IRON_SEAL_TTL),
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0,
};
export const IRON_SEAL = formatSealPassword();
export const IRON_UNSEAL = formatUnsealPasswords();

// --- INTERNAL FUNCTIONS ---

/** @internal */
function formatSealPassword(): SealPassword {
  const output = IRON_PASSWORDS.find((value) => value.id === IRON_CURRENT_PWD);
  if (!output) {
    throw new Error(
      'No record matching value of IRON_CURRENT_PWD found in IRON_PASSWORDS.',
    );
  }
  return output;
}

/** @internal */
function formatUnsealPasswords() {
  const output: Record<string, string> = {};
  IRON_PASSWORDS.forEach((value: SealPassword) => {
    output[value.id] = value.secret;
  });
  return output;
}

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

export async function extractOpenIdToken(
  req: NextApiRequest,
): Promise<IdTokenClaims> {
  const nonce = req.cookies[COOKIE.NONCE];
  if (!nonce) {
    throw new Error('Unable to load nonce from cookie');
  }

  const client = await getOidcClient();
  const params = client.callbackParams(req);
  const tokens = await client.callback(CALLBACK_URL, params, { nonce });
  return tokens.claims();
}

export async function getOidcClient(): Promise<Client> {
  const issuer = await Issuer.discover(`https://${DOMAIN}/authorize`);
  return new issuer.Client({
    client_id: CLIENT_ID,
    redirect_uris: [CALLBACK_URL],
    response_types: ['id_token token'],
  });
}

interface ResponseHandlerOutput {
  registerNewUser: boolean;
  sessionId: string;
}

export async function handleOidcResponse(
  req: NextApiRequest,
): Promise<ResponseHandlerOutput> {
  const nonce = req.cookies[COOKIE.NONCE];
  if (!nonce) {
    throw new Error('Unable to load nonce from cookie');
  }

  const client = await getOidcClient();
  const params = client.callbackParams(req);
  const tokens = await client.callback(CALLBACK_URL, params, { nonce });
  const claims = tokens.claims();

  const isRegisteredSubject = await isRegistered(claims);
  const { user, data } = isRegisteredSubject
    ? await login(claims)
    : await register(claims);
  const sessionId = await startSession(user, data);
  return {
    sessionId,
    registerNewUser: !isRegisteredSubject,
  };
}
