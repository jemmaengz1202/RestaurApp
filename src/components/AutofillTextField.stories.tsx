import React from 'react';
import { storiesOf } from '@storybook/react';
import WithTheme from '../components/WithTheme';
import { lightTheme } from '../themes';
import AutofillTextField from './AutofillTextField';

storiesOf('AutofillTextField', module)
  .add('Dark theme', () => (
    <WithTheme>
      <AutofillTextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label="Usuario"
        name="username"
        autoComplete="username"
        autoFocus
      />
    </WithTheme>
  ))
  .add('Light theme', () => (
    <WithTheme theme={lightTheme}>
      <AutofillTextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label="Usuario"
        name="username"
        autoComplete="username"
        autoFocus
      />
    </WithTheme>
  ));
