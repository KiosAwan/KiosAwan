import React from 'react';
import { Text as ReactNativeText } from 'react-native'
import { FontList, FontName } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';

export const Text = (props) => {
    const styles = {
        fontSize: props.size || 14,
        fontFamily: FontName[props.font] || FontName.SemiBold,
        color: ColorsList[props.color] || ColorsList.greyFont,
        width: props.width
    }
    return (<ReactNativeText {...props} style={[styles, props.style]} />)
}