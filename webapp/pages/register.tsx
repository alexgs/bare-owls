/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Formik, FormikHelpers } from 'formik';
import { Box, Heading, Paragraph } from 'grommet';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import * as Yup from 'yup';

import { AppBar } from 'components';
import { RegFormData, RegistrationForm } from 'components/Register';
import { getSession, prisma } from 'server-lib';

interface Props {
  displayName: string | null;
  email: string | null;
  subject: string;
  tokenId: string;
}

const formSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address.').required('Please enter a valid email address.'),
  name: Yup.string().required('Please enter your name.'),
  username: Yup.string().required('Please select a unique username.'),
});

const Register: React.FC<Props> = (props: Props) => {
  const initialData: RegFormData = {
    name: props.displayName ?? '',
    email: props.email ?? '',
    username: '',
  };

  function handleSubmit(values: RegFormData, formik: FormikHelpers<RegFormData>) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    };

    fetch('/api/update-profile', options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(JSON.stringify(response));
      })
      .then((payload) => {
        console.log(`<<- ${JSON.stringify(payload)} ->>`);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
  }

  return (
    <>
      <AppBar>
        <Heading level="3" margin="none">
          Bare Owls
        </Heading>
      </AppBar>

      <Box align="center" pad="medium" width={'100%'}>
        <Heading level={1} margin="none">
          Welcome!
        </Heading>
        <Paragraph>Please check your details before you get started.</Paragraph>
        <Box width={'50%'}>
          <Formik
            initialValues={initialData}
            onSubmit={handleSubmit}
            validationSchema={formSchema}
          >
            {(formik) => (
              <RegistrationForm
                formik={formik}
                initialValues={initialData}
                tokenId={props.tokenId}
              />
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> => {
  const session = await getSession(context.req);
  if (!session) {
    throw new Error('Invalid session.');
  }
  const tokenId = session.data?.tokenId as string;
  if (!tokenId) {
    throw new Error('Unable to get token ID from session data.');
  }

  const token = await prisma.userOpenIdToken.findUnique({
    where: { id: tokenId },
  });
  if (!token) {
    throw new Error(`Unable to find token ID "${tokenId}" in the database.`);
  }

  return {
    props: {
      displayName: token.nickname ?? token.name,
      email: token.email, // TODO Handle email address missing from claims
      subject: token.sub,
      tokenId: token.id,
    },
  };
};

export default Register;
