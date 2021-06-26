/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { SealOptions } from '@hapi/iron';
import * as cookie from 'cookie';
import * as env from 'env-var';
import ms from 'ms';
import { Issuer } from 'openid-client';

import { seconds } from 'lib';

type CookieOptionsSet = Record<string, cookie.CookieSerializeOptions>;

interface SealPassword {
  id: string;
  secret: string;
}

const BASE_URL = env.get('WEBAPP_BASE_URL').required().asString();
const CLIENT_ID = env.get('AUTH0_CLIENT_ID').required().asString();
const COOKIE_CURRENT_PWD = env.get('COOKIE_CURRENT_PWD').required().asString();
const COOKIE_PASSWORDS = env.get('COOKIE_PASSWORDS').required().asJsonArray();
const DOMAIN = env.get('AUTH0_DOMAIN').required().asString();

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
    maxAge: seconds('3m'),
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
    maxAge: seconds('7d'),
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
  ttl: ms('30d'),
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0,
};
export const IRON_SEAL = formatSealPassword();
export const IRON_UNSEAL = formatUnsealPasswords();

function formatSealPassword(): SealPassword {
  const output = COOKIE_PASSWORDS.find(value => value.id === COOKIE_CURRENT_PWD);
  if (!output) {
    throw new Error('No record matching value of COOKIE_CURRENT_PWD found in COOKIE_PASSWORDS.');
  }
  return output;
}

function formatUnsealPasswords() {
  const output = {};
  COOKIE_PASSWORDS.forEach((value: SealPassword) => {
    output[value.id] = value.secret;
  });
  return output;
}

export async function getOidcClient() {
  const issuer = await Issuer.discover(`https://${DOMAIN}/authorize`);
  return new issuer.Client({
    client_id: CLIENT_ID,
    redirect_uris: [CALLBACK_URL],
    response_types: ['id_token token'],
  });
}
