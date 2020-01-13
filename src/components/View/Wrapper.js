import React, { Component } from 'react';
import { View } from 'react-native';
export const Wrapper = props => {
	return <View style={[{ flexDirection: props.direction || 'row', justifyContent: props.justify || 'space-around' }, props.style]}>
		{
			props.children.length > 0 ?
				props.children.map((item, i) => {
					return <View style={[
						{ width: item.props._width, justifyContent: 'center' },
						item.props._style,
						item.props.style && item.props.style.width ? { width: item.props.style.width } : {},
						item.props.width ? { width: item.props.width } : {}
					]} key={i}>
						{item}
					</View>
				}
				) : props.children
		}
	</View>
}