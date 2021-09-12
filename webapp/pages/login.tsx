/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Formik, FormikHelpers } from 'formik';
import { Box, Heading } from 'grommet';
import * as React from 'react';
import * as Yup from 'yup';

import { NavBar } from 'components';
import { LoginForm, LoginFormData } from 'components/Login';

const schema = Yup.object({
  email: Yup.string().email('Please enter a valid email address.').required('Please enter a valid email address.'),
  password: Yup.string().required('Please enter your password.'),
});

const Login: React.FC = () => {
  const initialData: LoginFormData = {
    email: '',
    password: '',
  };

  function handleSubmit(values: LoginFormData, formik: FormikHelpers<LoginFormData>) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    };

    fetch('/api/login', options)
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
      <NavBar />
      <Box flex align="center" pad="medium" width="100%">
        <Heading level={1} margin="none">
          Welcome back!
        </Heading>
        <Box width={'50%'}>
          <Formik
            initialValues={initialData}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {(formik) => (
              <LoginForm
                formik={formik}
                initialValues={initialData}
              />
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export default Login;
