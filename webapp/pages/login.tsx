/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import Iron from '@hapi/iron';
import * as cookie from 'cookie';
import { Anchor, Box } from 'grommet';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { generators } from 'openid-client';
import * as React from 'react';

import { NavBar } from 'components';
import { getConfig, getOidcClient } from 'server-lib';

const showLink = true; // Useful for debugging

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
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const config = getConfig();
  const client = await getOidcClient(config);
  const url1 = client.authorizationUrl({
    scope: 'openid offline_access',
    // resource: 'https://my.api.example.com/resource/32178',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  const url2 = new URL(url1);
  url2.hostname = 'auth.owlbear.tech';
  url2.port = '';
  url2.protocol = 'https:';
  const url3 = url2.toString();

  const { COOKIE, IRON_OPTIONS, IRON_SEAL } = config;
  const sealedVerifier = await Iron.seal(codeVerifier, IRON_SEAL, IRON_OPTIONS);
  const verifierCookie = cookie.serialize(
    COOKIE.VERIFY.NAME,
    sealedVerifier,
    COOKIE.VERIFY.SET,
  );
  context.res.setHeader('set-cookie', verifierCookie);
  if (showLink) {
    return { props: { url: url3 } };
  }
  return {
    redirect: {
      destination: url3,
      statusCode: 302,
    },
  };
}

export default Login;
