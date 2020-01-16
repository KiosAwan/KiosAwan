import React, { Component } from 'react';
import { View } from 'react-native';
import { ColorsList } from 'src/styles/colors';

const Divider = props => {
	const { width, height } = props
	return <View style={{
		backgroundColor: props.color || ColorsList.greyAuthHard,
		padding: isNaN(props.size) ? .5 : props.size / 2, width, height, ...props.style
	}} />
}

export default Divider