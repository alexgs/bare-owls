/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Anchor, Box } from 'grommet';
import { GetServerSidePropsResult } from 'next';
import { generators } from 'openid-client';
import * as qs from 'query-string';
import * as React from 'react';

import { NavBar } from 'components';
import { getOidcClient } from 'server-lib';

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

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<unknown>
> {
  // TODO Store the code verifier in an encrypted cookie
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const client = await getOidcClient();
  const url1 = client.authorizationUrl({
    scope: 'openid',
    // resource: 'https://my.api.example.com/resource/32178',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  const url2 = new URL(url1);
  url2.hostname = 'auth.owlbear.tech'
  url2.port = '';
  url2.protocol = 'https:'
  // url2.origin = 'https://auth.owlbear.tech';
  const url3 = url2.toString();

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
