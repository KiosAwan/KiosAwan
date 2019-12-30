import React from 'react';
import { Image as ImageRN } from "react-native"

export const Image = props => {
	return <ImageRN {...props} style={[{ width: props.size || undefined, height: props.size || undefined }, props.style]} />
}
