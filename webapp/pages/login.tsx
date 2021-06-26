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
import { COOKIE, COOKIE_OPTIONS, getOidcClient } from 'lib';

const Login: React.FC = () => {
  return (<div>Login Page</div>);
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<unknown>> {
  const nonce = generators.nonce();

  const client = await getOidcClient();
  const url = client.authorizationUrl({
    nonce,
    response_mode: 'form_post',
    scope: 'openid email profile',
  });

  const nonceCookie = cookie.serialize(COOKIE.NONCE, nonce, COOKIE_OPTIONS.NONCE_SET);
  context.res.setHeader('set-cookie', nonceCookie);
  return {
    redirect: {
      destination: url,
      statusCode: 302,
    },
  };
}

export default Login;
