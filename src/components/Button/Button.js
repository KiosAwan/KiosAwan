import React, { Component } from 'react';
import { Text } from '../Text/CustomText';
import { TouchableOpacity, Animated } from 'react-native';
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
	return <Animated.View style={[{ width: props.width || undefined, opacity: props.disabled ? .5 : 1 }, props.style]}>
		<TouchableOpacity activeOpacity={.5} {...props} style={[{
			borderWidth: 1,
			justifyContent: 'center',
			borderRadius: props.noRadius ? 0 : 5
		},
		props.padding ?
			(typeof props.padding != 'number' ? props.padding : { padding: props.padding }) :
			$Padding(8, 10),
			_color, props.noBorder && { borderColor: ColorsList.transparent }]
		}>
			{
				['string', 'number'].includes(typeof props.children) ?
					<Text align="center" {...props.textProps}
						style={[{ alignSelf: props.align || 'center', color: _color.text }, props.textStyle]}>
						{props.children}
					</Text>
					:
					<Wrapper {...props.wrapper}>{props.children}</Wrapper>
			}
		</TouchableOpacity>
	</Animated.View>
}