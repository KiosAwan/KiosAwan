import React from 'react';
import { Text } from '../Text/CustomText';
import { TouchableOpacity, View } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Wrapper } from '../View/Wrapper';
import { $Padding, $Border } from 'src/utils/stylehelper';

export const Button = props => {
	const { padding, color, children, iconText } = props
	let Colors = {
		white: {
			borderColor: ColorsList.primary,
			backgroundColor: ColorsList.whiteColor,
			text: ColorsList.primary
		},
		primary: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.primary,
			text: ColorsList.whiteColor
		},
		success: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.success,
			text: ColorsList.whiteColor
		},
		danger: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.danger,
			text: ColorsList.whiteColor
		},
		warning: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.warning,
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
		if (color === key)
			_color = Colors[color]
	}
	if (color === 'linkPrimary') {
		_color = Colors.link
		_color.text = ColorsList.primary
	}
	if (Array.isArray(color)) {
		_color = {
			backgroundColor: ColorsList[color[0]],
			text: ColorsList[color[1]],
			borderColor: color.length === 3 ? ColorsList[color[2]] : ColorsList[color[0]]
		}
	}
	const _renderComponent = (comp, i) => {
		return i > 0 ? comp : <View style={{
			...$Border(ColorsList.greyAuthHard, 1),
			borderRadius: 10,
			width: 65,
			height: 65,
			alignItems: 'center',
			justifyContent: 'center'
		}}>{comp}</View>
	}
	// return <Animated.View style={[{ width: props.width || undefined, opacity: props.disabled ? 1 : 1 }]}>
	return <TouchableOpacity activeOpacity={.5} {...props} style={!iconText && {
		borderWidth: props.noBorder ? 0 : 1,
		width: props.width,
		justifyContent: 'center',
		borderRadius: props.noRadius ? 0 : 5,
		..._color,
		...padding ? typeof padding != 'number' ? padding : { padding: padding } : $Padding(8, 10),
		...props.noBorder && { borderColor: ColorsList.transparent },
		...props.style
	}}>
		{
			['string', 'number'].includes(typeof children) ?
				<Text align="center"
					style={[{ alignSelf: props.align || 'center', color: _color.text }, props.textStyle]} {...props.textProps}>
					{children}
				</Text>
				:
				iconText ? <View style={{ alignItems: 'center' }}>
					{Array.isArray(children) ?
						children.map((child, i) => _renderComponent(child, i)) :
						_renderComponent(children, 0)}
				</View> : <Wrapper {...props.wrapper}>{children}</Wrapper>
		}
	</TouchableOpacity>
	{/* </Animated.View> */ }
}