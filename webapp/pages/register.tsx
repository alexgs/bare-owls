/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Formik } from 'formik';
import { Box, Heading, Paragraph } from 'grommet';
import { isEqual } from 'lodash';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

import { AppBar } from 'components';
import { RegistrationForm } from 'components/Register';
import { getSession, prisma } from 'server-lib';

interface Props {
  displayName: string | null;
  email: string | null;
  subject: string;
  tokenId: string;
}

interface Data {
  email: string;
  name: string;
  username: string;
}

enum FetchStatus {
  Done = 'Done',
  Error = 'Error',
  Fetching = 'Fetching',
  Ready = 'Ready',
}

enum FormStatus {
  Error = 'Error',
  Ready = 'Ready',
  Untouched = 'Untouched',
}

const Register: React.FC<Props> = (props: Props) => {
  const initialData: Data = {
    name: props.displayName ?? '',
    email: props.email ?? '',
    username: '',
  };

  const [data, setData] = React.useState<Data>(initialData);
  const [fetchStatus, setFetchStatus] = React.useState<FetchStatus>(
    FetchStatus.Ready,
  );
  const [formStatus, setFormStatus] = React.useState<FormStatus>(
    FormStatus.Untouched,
  );
  const [response, setResponse] = React.useState<Record<string, unknown>>({});

  React.useEffect(() => {
    const formStatus = getFormStatus(data);
    setFormStatus(formStatus);
    console.log();
  }, [data]);

  function getFormStatus(currentData: Data): FormStatus {
    if (isEqual(currentData, initialData)) {
      return FormStatus.Untouched;
    }
    if (
      currentData.email.length > 0 &&
      currentData.name.length > 0 &&
      currentData.username.length > 0
    ) {
      return FormStatus.Ready;
    }
    return FormStatus.Error;
  }

  function handleChange(nextValue: Data) {
    setData(nextValue);
  }

  function handleReset() {
    setFormStatus(FormStatus.Untouched);
    setData(initialData);
  }

  function handleSubmit() {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    setFetchStatus(FetchStatus.Fetching);
    fetch('/api/update-profile', options)
      .then((response) => {
        if (response.ok) {
          setFetchStatus(FetchStatus.Done);
          return response.json();
        }
        throw new Error(JSON.stringify(response));
      })
      .then((payload) => {
        console.log(`<<- ${JSON.stringify(payload)} ->>`);
      })
      .catch((e) => {
        setFetchStatus(FetchStatus.Error);
        console.log(e);
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
          <Formik initialValues={initialData} onSubmit={handleSubmit}>
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
