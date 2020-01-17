import React, { Component } from 'react';
import { Text } from '../Text/CustomText';
import { TouchableOpacity, View } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Wrapper } from '../View/Wrapper';
import { $Padding } from 'src/utils/stylehelper';

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
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.transparent,
			text: ColorsList.greyFont
		},
		transparent: {
			borderColor: ColorsList.primary,
			backgroundColor: ColorsList.transparent,
			text: ColorsList.primary
		},
		transparentWhite: {
			borderColor: ColorsList.whiteColor,
			backgroundColor: ColorsList.transparent,
			text: ColorsList.whiteColor
		}
	}
	let _color = Colors.primary
	for (let key in Colors) {
		if (props.color === key)
			_color = Colors[props.color]
	}
	if (Array.isArray(props.color)) {
		_color = {
			backgroundColor: ColorsList[props.color[0]],
			text: ColorsList[props.color[1]],
			borderColor: props.color.length === 3 ? ColorsList[props.color[2]] : ColorsList[props.color[0]]
		}
	}
	return <TouchableOpacity activeOpacity={.7} {...props} style={[{
		borderWidth: 1,
		justifyContent: 'center',
		borderRadius: 5,
		width: props.width || undefined
	},
	props.padding ? typeof props.padding === 'number' ? { padding: props.padding } : props.padding : $Padding(5, 10),
		_color, props.style]
	}>
		{
			typeof props.children === 'string' ?
				<Text font="ExtraBold" align="center" {...props.textProps}
					style={[{ alignSelf: props.align || 'center', color: _color.text }, props.textStyle]}>
					{props.children}
				</Text>
				:
				<Wrapper {...props.wrapper}>{props.children}</Wrapper>
		}
	</TouchableOpacity>
}