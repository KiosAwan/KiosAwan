import React, { Component } from 'react';
import { View } from 'react-native';
import { ColorsList } from 'src/styles/colors';

const Divider = props => {
	const { color, size, flex, style, transparent } = props
	return <View style={{
		backgroundColor: transparent ? ColorsList.transparent : (ColorsList[color] || color || ColorsList.borderColor),
		padding: isNaN(size) ? .5 : size / 2,
		top: -.1,
		...flex && { flex: 1 },
		...style
	}}
	/>
}

export default Divider