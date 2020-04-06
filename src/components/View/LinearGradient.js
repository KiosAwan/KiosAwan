import React from 'react';
import GradienLinear from 'react-native-linear-gradient';
import { ColorsList } from 'src/styles/colors';

const LinearGradient = props => {
	const { color, style, children } = props
	return <GradienLinear {...props}
		colors={color || [ColorsList.primary, ColorsList.gradientPrimary]} style={{
			flex: 1,
			justifyContent: "space-between",
			backgroundColor: ColorsList.primary,
			...style
		}}>
		{children}
	</GradienLinear>
}
export default LinearGradient