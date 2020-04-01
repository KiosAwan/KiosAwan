import React, { Component } from 'react';
import { View } from 'react-native';
import { ColorsList } from 'src/styles/colors';

const Divider = props => {
	// const { width, height } = props
	// return <View style={{
	// 	backgroundColor: props.color || ColorsList.greyAuthHard,
	// 	padding: isNaN(props.size) ? .5 : props.size / 2,
	// 	flexDirection:'column'
	// 	// width, height, ...props.style
	// }} />
	return <View style={{
		backgroundColor: props.color || ColorsList.greyAuthHard,
		padding: isNaN(props.size) ? .5 : props.size / 2,
		top: -.1,
		...props.flex && { flex: 1 },
		...props.style
	}}
	/>
}

export default Divider