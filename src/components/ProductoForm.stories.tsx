import React from 'react';
import { storiesOf } from '@storybook/react';
import WithTheme from './WithTheme';
import { darkTheme, lightTheme } from '../themes';
import { ProductoForm, EditProductoForm } from './ProductoForm';

storiesOf('ProductoForm', module)
  .add('Dark theme', () => (
    <WithTheme theme={darkTheme}>
      <ProductoForm />
    </WithTheme>
  ))
  .add('Light theme', () => (
    <WithTheme theme={lightTheme}>
      <ProductoForm />
    </WithTheme>
  ))
  .add('Edition mode', () => {
    return <WithTheme theme={darkTheme}>
      <EditProductoForm id={2} />
    </WithTheme>
  
  });