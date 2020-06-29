import React from 'react';
import { Text as ReactNativeText, ViewPropTypes } from 'react-native';
import { FontName, FontNameKey } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';
import PropTypes from 'prop-types'

export const Text = props => {
    const {
        size,
        font,
        color,
        align,
        width,
        style: styleOverride
    } = props
    const styles = {
        fontSize: size || 14,
        fontFamily: FontName[font] || FontName.Regular,
        color: ColorsList[color] || color || font == "SemiBold" && ColorsList.greyFontHard || ColorsList.greyFont,
        textAlign: align || null,
        width: width
    }
    return <ReactNativeText {...props} style={[styles, styleOverride]} />
}
Text.propTypes = {
    size: PropTypes.number,
    align: PropTypes.string,
    width: PropTypes.number,
    style: ReactNativeText.propTypes.style,
    font: PropTypes.oneOf(FontNameKey),
    color: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf(Object.keys(ColorsList))
    ])
}

function a() {
    <Text style={{}} />
}