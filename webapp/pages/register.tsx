/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import {
  Box,
  Button,
  Form, FormExtendedEvent,
  FormField,
  Heading,
  Paragraph,
  TextInput,
} from 'grommet';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

import { AppBar } from 'components';
import { prisma } from 'server-lib';

interface Props {
  displayName: string | null;
  email: string | null;
  tokenId: string;
}

interface State {
  email: string;
  name: string;
  username: string;
}

const Register: React.FC<Props> = (props: Props) => {
  const initialState: State = {
    name: props.displayName ?? '',
    email: props.email ?? '',
    username: '',
  };
  const [value, setValue] = React.useState<State>(initialState);

  function handleChange(nextValue: State) {
    setValue(nextValue);
  }

  function handleReset() {
    setValue(initialState);
  }

  function handleSubmit(event: FormExtendedEvent<State>) {
    console.log(`<<- ${JSON.stringify(event.value)} ->>`);
  }

  return (
    <>
      <AppBar>
        <Heading level="3" margin="none">Bare Owls</Heading>
      </AppBar>

      <Box align="center" pad="medium" width={'100%'}>
        <Heading level={1} margin="none">Welcome!</Heading>
        <Paragraph>Please check your details before you get started.</Paragraph>
        <Box width={'50%'}>
          <Form
            value={value}
            onChange={handleChange}
            onReset={handleReset}
            onSubmit={handleSubmit}
          >
            <FormField name="username" htmlFor="username-input" label="Username">
              <TextInput id="username-input" name="username" />
            </FormField>
            <FormField name="name" htmlFor="name-input" label="Name">
              <TextInput id="name-input" name="name" />
            </FormField>
            <FormField name="email" htmlFor="email-input" label="Email address">
              <TextInput id="email-input" name="email" />
            </FormField>
            <Box direction="row" gap="medium" margin={{ top: 'large' }}>
              <Button type="submit" primary label="Submit" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        </Box>
      </Box>
    </>
  );
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
