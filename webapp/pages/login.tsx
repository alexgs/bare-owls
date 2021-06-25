/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as cookie from 'cookie';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { generators } from 'openid-client';
import * as React from 'react';
import { COOKIE, getAuth0Client } from 'lib';

const COOKIE_OPTIONS: cookie.CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 180,
  path: '/',
  secure: true,
};

const Login: React.FC = () => {
  return (<div>Login Page</div>);
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<unknown>> {
  const nonce = generators.nonce();

  const client = await getAuth0Client();
  const url = client.authorizationUrl({
    nonce,
    response_mode: 'form_post',
    scope: 'openid email profile',
  });

  const nonceCookie = cookie.serialize(COOKIE.NONCE, nonce, COOKIE_OPTIONS);
  context.res.setHeader('set-cookie', nonceCookie);
  return {
    redirect: {
      destination: url,
      statusCode: 302,
    },
  };
}

export default Login;
