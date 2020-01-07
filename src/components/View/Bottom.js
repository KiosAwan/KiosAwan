import React, { Component } from 'react';
import { View } from 'react-native';
export const Bottom = props => {
	return (
		<View style={{
			alignSelf: 'center',
			position: 'absolute',
			bottom: 0,
			flexDirection: props.direction || 'row',
			justifyContent: props.justify || 'space-around',
			padding: props.padding || 20,
			width: '100%',
		}}>
			{props.children}
		</View>
	)
}