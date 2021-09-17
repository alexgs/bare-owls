/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { SealOptions } from '@hapi/iron';
import * as cookie from 'cookie';
import * as env from 'env-var';
import { mapValues } from 'lodash';
import ms from 'ms';

import { seconds } from 'lib';
import { TOKEN_CONTEXT } from 'server-lib/constants';

import { TokenContext } from './auth-client/types';

interface BaseConfig {
  AUTH_API_KEY: string;
  AUTH_APP_IDS: string[];
  AUTH_APP_TOKEN_CONTEXT: Record<string, TokenContext>;
  AUTH_DEFAULT_PASSWORD: string;
  AUTH_ORIGIN_EXTERNAL: string;
  AUTH_ORIGIN_INTERNAL: string;
  AUTH_PATH_DISCOVERY: string;
  BASE_URL: string;
  CALLBACK_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  COOKIE: CookieOptionsSet;
  IRON_OPTIONS: SealOptions;
  IRON_SEAL: SealPassword;
  IRON_UNSEAL: Record<string, string>;
}

export type Config = Readonly<BaseConfig>;

type CookieOptionsSet = Record<
  string,
  {
    NAME: string;
    RM: cookie.CookieSerializeOptions;
    SET: cookie.CookieSerializeOptions;
  }
>;

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
function formatSealPassword(
  passwords: IronPasswords,
  currentPasswordKey: string,
): SealPassword {
  const output = passwords.find((value) => value.id === currentPasswordKey);
  if (!output) {
    throw new Error(
      'No record matching value of IRON_CURRENT_PWD found in IRON_PASSWORDS.',
    );
  }
  return output;
}

function formatTokenContexts(
  envVar: Record<string, string>,
): Record<string, TokenContext> {
  return mapValues(envVar, (value): TokenContext => {
    // I couldn't figure out how to do this generically, and this is good enough for now.
    if (value === 'OPEN') {
      return TOKEN_CONTEXT.OPEN;
    } else if (value === 'SECURE') {
      return TOKEN_CONTEXT.SECURE;
    } else {
      throw new Error(`Unknown token context "${value}"`);
    }
  });
}

/** @internal */
function formatUnsealPasswords(passwords: IronPasswords) {
  const output: Record<string, string> = {};
  passwords.forEach((value: SealPassword) => {
    output[value.id] = value.secret;
  });
  return output;
}

// --- PUBLIC FUNCTIONS ---

// The `env.get` functions were failing in a misleading way when they were in a
//   module's global context, which lead to a lot of wasted time. >:-(
export function getConfig(): Config {
  // Hidden vars -- only used for computing other values
  const COOKIE_ACCESS_TOKEN_TTL = env
    .get('COOKIE_ACCESS_TOKEN_TTL')
    .required()
    .asString();
  const COOKIE_REFRESH_TOKEN_TTL = env
    .get('COOKIE_REFRESH_TOKEN_TTL')
    .required()
    .asString();
  const COOKIE_VERIFY_TTL = env.get('COOKIE_VERIFY_TTL').required().asString();
  const IRON_CURRENT_PWD = env.get('IRON_CURRENT_PWD').required().asString();
  const IRON_PASSWORDS = env
    .get('IRON_PASSWORDS')
    .required()
    .asJsonArray() as IronPasswords;
  const IRON_SEAL_TTL = env.get('IRON_SEAL_TTL').required().asString();
  const tokenContexts = env
    .get('AUTH_APP_TOKEN_CONTEXT')
    .required()
    .asJsonObject() as Record<string, string>;

  // Direct vars -- go right into the output without modification
  const AUTH_API_KEY = env.get('WEBAPP_AUTH_API_KEY').required().asString();
  const AUTH_APP_IDS = env
    .get('AUTH_APP_IDS')
    .required()
    .asJsonArray() as string[];
  const AUTH_DEFAULT_PASSWORD = env
    .get('AUTH_DEFAULT_PASSWORD')
    .required()
    .asString();
  const AUTH_ORIGIN_EXTERNAL = env
    .get('AUTH_ORIGIN_EXTERNAL')
    .required()
    .asString();
  const AUTH_ORIGIN_INTERNAL = env
    .get('AUTH_ORIGIN_INTERNAL')
    .required()
    .asString();
  const AUTH_PATH_DISCOVERY = env
    .get('AUTH_PATH_DISCOVERY')
    .required()
    .asString();
  const BASE_URL = env.get('WEBAPP_BASE_URL').required().asString();
  const CLIENT_ID = env.get('AUTH_CLIENT_ID').required().asString();
  const CLIENT_SECRET = env.get('AUTH_CLIENT_SECRET').required().asString();

  // Computed vars
  const AUTH_APP_TOKEN_CONTEXT = formatTokenContexts(tokenContexts);
  const CALLBACK_URL = `${BASE_URL}/api/callback`;
  const COOKIE: CookieOptionsSet = {
    ACCESS_TOKEN: {
      NAME: 'access-token',
      RM: {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        sameSite: 'none', // This should match ACCESS_TOKEN.SET.sameSite
        secure: true,
      },
      SET: {
        httpOnly: true,
        maxAge: seconds(COOKIE_ACCESS_TOKEN_TTL),
        path: '/',
        sameSite: 'none', // This should match ACCESS_TOKEN.RM.sameSite
        secure: true,
      },
    },
    REFRESH_TOKEN: {
      NAME: 'refresh-token',
      RM: {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        sameSite: 'none', // This should match REFRESH_TOKEN.SET.sameSite
        secure: true,
      },
      SET: {
        httpOnly: true,
        maxAge: seconds(COOKIE_REFRESH_TOKEN_TTL),
        path: '/',
        sameSite: 'none', // This should match REFRESH_TOKEN.RM.sameSite
        secure: true,
      },
    },
    VERIFY: {
      NAME: 'iron-owl',
      RM: {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        sameSite: 'none', // This should match VERIFY.SET.sameSite
        secure: true,
      },
      SET: {
        httpOnly: true,
        maxAge: seconds(COOKIE_VERIFY_TTL),
        path: '/',
        sameSite: 'none', // This should match VERIFY.RM.sameSite
        secure: true,
      },
    },
  };
  // noinspection SpellCheckingInspection
  const IRON_OPTIONS: SealOptions = {
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
  const IRON_SEAL = formatSealPassword(IRON_PASSWORDS, IRON_CURRENT_PWD);
  const IRON_UNSEAL = formatUnsealPasswords(IRON_PASSWORDS);

  return {
    AUTH_API_KEY,
    AUTH_APP_IDS,
    AUTH_APP_TOKEN_CONTEXT,
    AUTH_DEFAULT_PASSWORD,
    AUTH_ORIGIN_EXTERNAL,
    AUTH_ORIGIN_INTERNAL,
    AUTH_PATH_DISCOVERY,
    BASE_URL,
    CALLBACK_URL,
    CLIENT_ID,
    CLIENT_SECRET,
    COOKIE,
    IRON_OPTIONS,
    IRON_SEAL,
    IRON_UNSEAL,
  };
}
