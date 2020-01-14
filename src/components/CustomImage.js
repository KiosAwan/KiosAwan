import React from 'react';
import { Image as ImageRN ,TouchableOpacity} from "react-native"

export const Image = props => {
	return <ImageRN {...props} style={[{ width: props.size || null, height: props.size || null }, props.style]} />
}

export const ImageAuto = props => <ImageRN {...props} style={{ width: null, height: null, flex: 1, ...props.style }} />