/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Anchor, Box } from 'grommet';
import { GetServerSidePropsResult } from 'next';
import * as qs from 'query-string';
import * as React from 'react';

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
  return <div>Login Page</div>;
};

export function getServerSideProps(): GetServerSidePropsResult<unknown> {
  const AUTH_BASE_URL = 'http://localhost:9011';
  const query = qs.stringify({
    client_id: '2323677f-62b9-467f-8cd6-931169f237f9',
    redirect_uri: 'https://localhost.owlbear.tech/callback',
    response_type: 'code',
  })
  const url = `${AUTH_BASE_URL}/oauth2/authorize?${query}`;

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
