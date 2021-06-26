/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { SealOptions } from '@hapi/iron';
import * as cookie from 'cookie';
import * as env from 'env-var';
import ms from 'ms';
import { NextApiRequest } from 'next';
import { IdTokenClaims, Issuer } from 'openid-client';

import { seconds } from 'lib';
import { prisma } from 'server-lib';
import { UserData } from 'types';

import { startSession } from './session';

type CookieOptionsSet = Record<string, cookie.CookieSerializeOptions>;

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
const IRON_PASSWORDS = env.get('IRON_PASSWORDS').required().asJsonArray();
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
    secure: true,
  },
  NONCE_SET: {
    httpOnly: true,
    maxAge: seconds(COOKIE_NONCE_TTL),
    path: '/',
    secure: true,
  },
  SESSION_RM: {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
    sameSite: 'strict',
    secure: true,
  },
  SESSION_SET: {
    httpOnly: true,
    maxAge: seconds(COOKIE_SESSION_TTL),
    path: '/',
    sameSite: 'strict',
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
export function formatSealPassword(): SealPassword {
  const output = IRON_PASSWORDS.find(value => value.id === IRON_CURRENT_PWD);
  if (!output) {
    throw new Error('No record matching value of IRON_CURRENT_PWD found in IRON_PASSWORDS.');
  }
  return output;
}

/** @internal */
export function formatUnsealPasswords() {
  const output: Record<string, string> = {};
  IRON_PASSWORDS.forEach((value: SealPassword) => {
    output[value.id] = value.secret;
  });
  return output;
}

/** @internal */
async function isRegistered(claims: IdTokenClaims): Promise<boolean> {
  const count = await prisma.userOpenIdToken.count({ where: { sub: claims.sub } });
  if (count > 1) {
    throw new Error(`Found multiple tokens for subject "${claims.sub}".`);
  }
  return count === 1;
}

/** @internal */
async function login(claims: IdTokenClaims): Promise<UserData> {
  // TODO
}

/** @internal */
async function register(claims: IdTokenClaims): Promise<UserData> {
  // TODO
}

// --- PUBLIC FUNCTIONS ---

export async function getOidcClient() {
  const issuer = await Issuer.discover(`https://${DOMAIN}/authorize`);
  return new issuer.Client({
    client_id: CLIENT_ID,
    redirect_uris: [CALLBACK_URL],
    response_types: ['id_token token'],
  });
}

export async function handleOidcResponse(req: NextApiRequest): Promise<string> {
  const nonce = req.cookies[COOKIE.NONCE];
  if (!nonce) {
    throw new Error('Unable to load nonce from cookie');
  }

  const client = await getOidcClient();
  const params = client.callbackParams(req);
  const tokens = await client.callback(CALLBACK_URL, params, { nonce });
  const claims = tokens.claims();

  const isRegisteredSubject = await isRegistered(claims);
  const userData = isRegisteredSubject ? await login(claims) : await register(claims);
  return startSession(userData);
}

