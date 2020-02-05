import React from 'react'
import { TextField } from "react-native-materialui-textfield"
import { ColorsList } from 'src/styles/colors'

const MDInput = props => {
	return <TextField
		fontSize={13}
		tintColor={ColorsList.primary}
		textColor={ColorsList.text}
		baseColor={ColorsList.secondary}
		{...props}
	/>
}

export default MDInput