/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { FormikProps } from 'formik';
import { Box, Button, FormField, TextInput } from 'grommet';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { LoginFormData } from './types';

interface Props {
  formik: FormikProps<LoginFormData>;
  initialValues: LoginFormData;
}

export const LoginForm: React.FC<Props> = (props: Props) => {
  const { formik } = props;
  const disableReset = formik.isSubmitting;
  const disableSubmit =
    !formik.dirty || !isEmpty(formik.errors) || formik.isSubmitting;

  return (
    <form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
      <FormField
        error={formik.touched.email && formik.errors.email}
        htmlFor="email-input"
        label="Email"
        name="email"
      >
        <TextInput
          id="email-input"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.email || ''}
        />
      </FormField>
      <FormField
        error={formik.touched.password && formik.errors.password}
        htmlFor="password-input"
        label="Password"
        name="password"
      >
        <TextInput
          id="password-input"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password || ''}
        />
      </FormField>
      <Box direction="row" gap="medium" margin={{ top: 'large' }}>
        <Button type="submit" label="Submit" primary disabled={disableSubmit} />
        <Button type="reset" label="Reset" disabled={disableReset} />
      </Box>
    </form>
  );
};
