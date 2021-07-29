/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { FormikProps } from 'formik';
import { Box, Button, FormField, TextInput } from 'grommet';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { RegFormData } from './types';

interface Props {
  formik: FormikProps<RegFormData>;
  initialValues: RegFormData;
  tokenId: string;
}

export const RegistrationForm: React.FC<Props> = (props: Props) => {
  const { formik } = props;
  const disableReset = formik.isSubmitting;
  const disableSubmit =
    !formik.dirty || !isEmpty(formik.errors) || formik.isSubmitting;

  return (
    <form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
      <input name="tokenId" type="hidden" value={props.tokenId} />
      <FormField
        error={formik.errors.username}
        htmlFor="username-input"
        label="Username"
        name="username"
      >
        <TextInput
          id="username-input"
          name="username"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.username || ''}
        />
      </FormField>
      <FormField
        error={formik.errors.name}
        htmlFor="name-input"
        label="Name"
        name="name"
      >
        <TextInput
          id="name-input"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.name || ''}
        />
      </FormField>
      <FormField
        error={formik.errors.email}
        htmlFor="email-input"
        label="Email address"
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
      <Box direction="row" gap="medium" margin={{ top: 'large' }}>
        <Button type="submit" label="Submit" primary disabled={disableSubmit} />
        <Button type="reset" label="Reset" disabled={disableReset} />
      </Box>
    </form>
  );
};
