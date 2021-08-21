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
  const COOKIE_VERIFY_TTL = env.get('COOKIE_VERIFY_TTL').required().asString();
  const IRON_CURRENT_PWD = env.get('IRON_CURRENT_PWD').required().asString();
  const IRON_PASSWORDS = env
    .get('IRON_PASSWORDS')
    .required()
    .asJsonArray() as IronPasswords;
  const IRON_SEAL_TTL = env.get('IRON_SEAL_TTL').required().asString();

  // There's probably a good way to do typing in here, but I don't know what it
  //   is right now, and I don't want to figure it out at the moment (2021-08-
  //   20). I'm leaving this here as a possible future starting point
  // const output: BaseConfig = {
  //   AUTH_HOST_EXTERNAL: '',
  //   IRON_PASSWORDS: [],
  //   COOKIE: {},
  //   IRON_SEAL: {
  //     id: '',
  //     secret: '',
  //   }
  // };

  const output: Partial<BaseConfig> = {};
  output.AUTH_ORIGIN_EXTERNAL = env
    .get('AUTH_ORIGIN_EXTERNAL')
    .required()
    .asString();
  output.AUTH_ORIGIN_INTERNAL = env
    .get('AUTH_ORIGIN_INTERNAL')
    .required()
    .asString();
  output.AUTH_PATH_DISCOVERY = env
    .get('AUTH_PATH_DISCOVERY')
    .required()
    .asString();
  output.BASE_URL = env.get('WEBAPP_BASE_URL').required().asString();
  output.CLIENT_ID = env.get('AUTH_CLIENT_ID').required().asString();
  output.CLIENT_SECRET = env.get('AUTH_CLIENT_SECRET').required().asString();

  output.CALLBACK_URL = `${output.BASE_URL}/api/callback`;
  output.COOKIE = {
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
    ttl: ms(IRON_SEAL_TTL),
    timestampSkewSec: 60,
    localtimeOffsetMsec: 0,
  };
  output.IRON_SEAL = formatSealPassword(IRON_PASSWORDS, IRON_CURRENT_PWD);
  output.IRON_UNSEAL = formatUnsealPasswords(IRON_PASSWORDS);

  return output as Config;
}
