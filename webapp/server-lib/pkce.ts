/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import crypto from 'crypto';

// Source: https://github.com/FusionAuth/fusionauth-example-react/blob/master/server/helpers/pkce.js

// --- PRIVATE FUNCTIONS ---

/** @internal */
function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/** @internal */
function sha256(buffer: Buffer): Buffer {
  return crypto.createHash('sha256').update(buffer).digest();
}

// --- PUBLIC FUNCTIONS ---

function generateChallenge(verifier: string): string {
  const buffer = Buffer.from(verifier);
  return base64UrlEncode(sha256(buffer));
}

function generateVerifier(): string {
  return base64UrlEncode(crypto.randomBytes(32));
}

export const pkce = {
  generateChallenge,
  generateVerifier,
}
