/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { SealOptions } from '@hapi/iron';
import * as cookie from 'cookie';
import * as env from 'env-var';
import ms from 'ms';

import { seconds } from 'lib';

interface BaseConfig {
  AUTH_HOST_EXTERNAL: string;
  AUTH_HOST_INTERNAL: string;
  AUTH_PATH_DISCOVERY: string;
  BASE_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  COOKIE_NONCE_TTL: string;
  COOKIE_SESSION_TTL: string;
  IRON_CURRENT_PWD: string;
  IRON_PASSWORDS: IronPasswords;
  IRON_SEAL_TTL: string;
  CALLBACK_URL: string;
  COOKIE: Record<string, string>;
  COOKIE_OPTIONS: CookieOptionsSet;
  IRON_OPTIONS: SealOptions;
  IRON_SEAL: SealPassword;
  IRON_UNSEAL:  Record<string, string>;
}

export type Config = Readonly<BaseConfig>

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

// --- INTERNAL FUNCTIONS ---

/** @internal */
function formatSealPassword(IRON_PASSWORDS: IronPasswords, IRON_CURRENT_PWD: string): SealPassword {
  const output = IRON_PASSWORDS.find((value) => value.id === IRON_CURRENT_PWD);
  if (!output) {
    throw new Error(
      'No record matching value of IRON_CURRENT_PWD found in IRON_PASSWORDS.',
    );
  }
  return output;
}

/** @internal */
function formatUnsealPasswords(IRON_PASSWORDS: IronPasswords) {
  const output: Record<string, string> = {};
  IRON_PASSWORDS.forEach((value: SealPassword) => {
    output[value.id] = value.secret;
  });
  return output;
}

// --- PUBLIC FUNCTIONS ---

// The `env.get` functions were failing in a misleading way when they were in a
//   module's global context, which lead to a lot of wasted time. >:-(
export function getConfig(): Config {
  const output: Partial<BaseConfig> = {};
  output.AUTH_HOST_EXTERNAL = env.get('AUTH_HOST_EXTERNAL').required().asString();
  output.AUTH_HOST_INTERNAL = env.get('AUTH_HOST_INTERNAL').required().asString();
  output.AUTH_PATH_DISCOVERY = env
    .get('AUTH_PATH_DISCOVERY')
    .required()
    .asString();
  output.BASE_URL = env.get('WEBAPP_BASE_URL').required().asString();
  output.CLIENT_ID = env.get('AUTH_CLIENT_ID').required().asString();
  output.CLIENT_SECRET = env.get('AUTH_CLIENT_SECRET').required().asString();
  output.COOKIE_NONCE_TTL = env.get('COOKIE_NONCE_TTL').required().asString();
  output.COOKIE_SESSION_TTL = env.get('COOKIE_SESSION_TTL').required().asString();
  output.IRON_CURRENT_PWD = env.get('IRON_CURRENT_PWD').required().asString();
  output.IRON_PASSWORDS = env
    .get('IRON_PASSWORDS')
    .required()
    .asJsonArray() as IronPasswords;
  output.IRON_SEAL_TTL = env.get('COOKIE_SESSION_TTL').required().asString();

  output.CALLBACK_URL = `${output.BASE_URL}/api/callback`;
  output.COOKIE = {
    SESSION: 'iron-owl',
    NONCE: 'bare-owls-nonce',
  };
  output.COOKIE_OPTIONS = {
    NONCE_RM: {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'none', // This should match NONCE_SET.sameSite
      secure: true,
    },
    NONCE_SET: {
      httpOnly: true,
      maxAge: seconds(output.COOKIE_NONCE_TTL),
      path: '/',
      sameSite: 'none',
      secure: true,
    },
    SESSION_RM: {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict', // This should match SESSION_SET.sameSite
      secure: true,
    },
    SESSION_SET: {
      httpOnly: true,
      maxAge: seconds(output.COOKIE_SESSION_TTL),
      path: '/',
      sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict', // This might need to be "lax"
      secure: true,
    },
  };
// noinspection SpellCheckingInspection
  output.IRON_OPTIONS = {
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
    ttl: ms(output.IRON_SEAL_TTL),
    timestampSkewSec: 60,
    localtimeOffsetMsec: 0,
  };
  output.IRON_SEAL = formatSealPassword(output.IRON_PASSWORDS, output.IRON_CURRENT_PWD);
  output.IRON_UNSEAL = formatUnsealPasswords(output.IRON_PASSWORDS);

  return output as Config;
}
