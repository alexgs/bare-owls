/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as cookie from 'cookie';
import { Anchor, Box } from 'grommet';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { generators } from 'openid-client';
import * as React from 'react';
import { COOKIE, COOKIE_OPTIONS, getOidcClient } from 'server-lib';

const showLink = false; // Useful for debugging

interface Props {
  url?: string;
}

const Login: React.FC<Props> = (props: Props) => {
  if (showLink && props.url) {
    return (
      <Box flex align="start" direction="column" justify="start" pad="medium">
        <Anchor label="Do it" href={props.url} />
      </Box>
    );
  }
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
  if (showLink) {
    return { props: { url } };
  }
  return {
    redirect: {
      destination: url,
      statusCode: 302,
    },
  };
}

export default Login;
