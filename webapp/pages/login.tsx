/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Formik, FormikHelpers } from 'formik';
import { Box, Heading, Text } from 'grommet';
import { useRouter } from 'next/router';
import * as React from 'react';
import * as Yup from 'yup';

import { NavBar } from 'components';
import { LoginForm, LoginFormData } from 'components/Login';

const schema = Yup.object({
  email: Yup.string().email('Please enter a valid email address.').required('Please enter a valid email address.'),
  password: Yup.string().required('Please enter your password.'),
});

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const router = useRouter();
  const initialData: LoginFormData = {
    email: '',
    password: '',
  };

  async function handleSubmit(
    values: LoginFormData,
    formik: FormikHelpers<LoginFormData>,
  ) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    };

    const response = await fetch('/api/login', options);
    if (response.ok) {
      // TODO Handle storing access token(s) locally
      // const payload = (await response.json()) as Record<string, unknown>;
      await router.push('/');
    } else if (response.status === 400) {
      setErrorMessage('Please check your credentials and try again.');
    } else if (response.status >= 500 && response.status < 600) {
      setErrorMessage(
        'Something went wrong on the server. Please try again later.',
      );
    } else {
      setErrorMessage(`Unexpected status code ${response.status}.`);
    }
    formik.setSubmitting(false);
  }

  return (
    <>
      <NavBar />
      <Box flex align="center" pad="medium" width="100%">
        <Heading level={1} margin="none">
          Welcome back!
        </Heading>
        <Text color="status-error" margin="small">
          {errorMessage}
        </Text>
        <Box width={'50%'}>
          <Formik
            initialValues={initialData}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {(formik) => (
              <LoginForm formik={formik} initialValues={initialData} />
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export default Login;
