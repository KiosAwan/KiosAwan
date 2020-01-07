import React, { Component } from 'react';
import { Text } from '../Text/CustomText';
import { TouchableOpacity, View } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Wrapper } from '../View/Wrapper';

export const Button = props => {
	let Colors = {
		white: {
			borderColor: ColorsList.primary,
			backgroundColor: ColorsList.whiteColor,
			text: ColorsList.primary
		},
		primary: {
			borderColor: ColorsList.primary,
			backgroundColor: ColorsList.primary,
			text: ColorsList.whiteColor
		},
		link: {
			borderColor: 'transparent',
			backgroundColor: 'transparent',
			text: ColorsList.greyFont
		}
	}
	let _color = Colors.primary
	for (let key in Colors) {
		if (props.color === key)
			_color = Colors[props.color]
	}
	return <TouchableOpacity {...props} style={[{
		padding: props.padding || 10,
		borderWidth: 1,
		justifyContent: 'center',
		borderRadius: 5,
		width: props.width || undefined
	}, _color, props.style]}>
		{
			typeof props.children === 'string' ?
				<Text font="ExtraBold" {...props.textProps}
					style={[{ alignSelf: props.align || 'center', color: _color.text }, props.textStyle]}>
					{props.children}
				</Text>
				:
				<Wrapper {...props.wrapper}>
					{props.children.length > 0 ?
						props.children.map((child, i) => {
							return <View key={i} style={{ marginRight: 5, justifyContent: 'center' }}>{child}</View>
						})
						:
						props.children
					}
				</Wrapper>
		}
	</TouchableOpacity>
}