/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

import { prisma } from 'server-lib';

interface Props {
  displayName: string | null;
  email: string | null;
  tokenId: string;
}

const Register: React.FC<Props> = (props: Props) => {
  return (<div>Hello {props.displayName}!</div>);
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> => {
  const { tokenId } = context.query;
  if (!tokenId) {
    throw new Error('Unable to get token ID from query string.');
  }
  if (Array.isArray(tokenId)) {
    throw new Error(`Query string must contain exactly one token ID, ${tokenId.length} found`);
  }

  const token = await prisma.userOpenIdToken.findUnique({ where: { id: tokenId } });
  if (!token) {
    throw new Error(`Unable to find token ID "${tokenId}" in the database.`);
  }

  return {
    props: {
      tokenId: token.id,
      displayName: token.nickname ?? token.name,
      email: token.email,
    },
  };
};

export default Register;
