import React from 'react';
import MDInput from './MDInput';

export const FloatingInputLabelCurrency = props => {
  const { handleChangeText } = props
  return <MDInput
    {...props}
    currency
    onChangeText={handleChangeText}
  />
}
