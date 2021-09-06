/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import * as cookie from 'cookie';
import { Anchor, Box } from 'grommet';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as querystring from 'query-string';
import * as React from 'react';

import { NavBar } from 'components';
import { COOKIE_HEADER, getConfig, pkce } from 'server-lib';

const showLink = false; // Useful for debugging

interface Props {
  url?: string;
}

const Login: React.FC<Props> = (props: Props) => {
  if (showLink && props.url) {
    return (
      <>
        <NavBar />
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <Anchor label="Do it" href={props.url} />
        </Box>
      </>
    );
  }
  return <div>Login Page</div>;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<unknown>> {
  const codeVerifier = pkce.generateVerifier();
  const codeChallenge = pkce.generateChallenge(codeVerifier);

  const {
    AUTH_ORIGIN_EXTERNAL,
    CALLBACK_URL,
    CLIENT_ID,
    COOKIE,
    IRON_OPTIONS,
    IRON_SEAL,
  } = getConfig();

  const query = querystring.stringify({
    client_id: CLIENT_ID,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_uri: CALLBACK_URL,
    response_type: 'code',
    scope: 'openid offline_access',
  });
  const url = `${AUTH_ORIGIN_EXTERNAL}/oauth2/authorize?${query}`;

  const sealedVerifier = await Iron.seal(codeVerifier, IRON_SEAL, IRON_OPTIONS);
  const verifierCookie = cookie.serialize(
    COOKIE.VERIFY.NAME,
    sealedVerifier,
    COOKIE.VERIFY.SET,
  );
  context.res.setHeader(COOKIE_HEADER, verifierCookie);

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
