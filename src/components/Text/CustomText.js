import React from 'react';
import { Text as ReactNativeText } from 'react-native'
import { FontList } from '../../styles/typography';

export const Text = (props) => {
    return (<ReactNativeText {...props} style={[{ ...FontList.subtitleFontGreyBold }, props.style]} />)
}