import React, { Component } from 'react';
import { View } from 'react-native';
import { ColorsList } from 'src/styles/colors';

const Divider = props => {
	const { color, size, flex, style } = props
	return <View style={{
		backgroundColor: ColorsList[color] || color || ColorsList.greyAuthHard,
		padding: isNaN(size) ? .5 : size / 2,
		top: -.1,
		...flex && { flex: 1 },
		...style
	}}
	/>
}

export default Divider