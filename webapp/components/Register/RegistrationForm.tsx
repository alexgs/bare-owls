/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { FormikProps } from 'formik';
import { Box, Button, FormField, TextInput } from 'grommet';
import { isEqual } from 'lodash';
import * as React from 'react';

interface Data {
  email: string;
  name: string;
  username: string;
}

interface Props {
  formik: FormikProps<Data>;
  initialValues: Data;
  tokenId: string;
}

export const RegistrationForm: React.FC<Props> = (props: Props) => {
  const { formik } = props;
  const disableSubmit = isEqual(props.initialValues, props.formik.values);

  return (
    <form onSubmit={formik.handleSubmit}>
      <input name="tokenId" type="hidden" value={props.tokenId} />
      <FormField
        error={formik.errors.username}
        name="username"
        htmlFor="username-input"
        label="Username"
      >
        <TextInput
          id="username-input"
          name="username"
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
          onChange={formik.handleChange}
          value={formik.values.email || ''}
        />
      </FormField>
      <Box direction="row" gap="medium" margin={{ top: 'large' }}>
        <Button
          type="submit"
          disabled={disableSubmit}
          primary
          label="Submit"
        />
        <Button type="reset" label="Reset" />
      </Box>
    </form>
  );
};
