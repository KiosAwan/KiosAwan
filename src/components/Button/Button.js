import React from 'react';
import { Text } from '../Text/CustomText';
import { TouchableOpacity } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Wrapper } from '../View/Wrapper';
import { $Padding, $Border } from 'src/utils/stylehelper';

export const Button = props => {
	const { borderBottom, padding, color, activeColor, active, children } = props
	const { flexStart, flexEnd, center, spaceAround, spaceBetween } = props
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
		success: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.success,
			text: ColorsList.whiteColor
		},
		info: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.infoBg,
			text: ColorsList.info
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
		purple: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.purpleSoft,
			text: ColorsList.purple
		},
		link: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.transparent,
			text: ColorsList.greyFont
		},
		linkPrimary: {
			borderColor: ColorsList.transparent,
			backgroundColor: ColorsList.transparent,
			text: ColorsList.primary
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
	const generateColor = color => {
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
		if (borderBottom) {
			const { backgroundColor } = _color
			_color = {
				borderRadius: 0,
				text: backgroundColor,
				...$Border(backgroundColor, 0, 0, 2, 0)
			}
		}
		return _color
	}
	let _color = Colors.white
	let _activeColor = Colors.white
	_color = generateColor(color)
	_activeColor = generateColor(activeColor)
	const ifWhitespaces = () => {
		if (
			['number', 'string'].includes(typeof children) &&
			children.toString().replace(/\s/g, '').length == 0 &&
			props.hideIfEmpty
		) {
			return true
		}
		return false
	}
	// return <Animated.View style={[{ width: props.width || undefined, opacity: props.disabled ? 1 : 1 }]}>
	return <TouchableOpacity activeOpacity={.5} {...props} style={{
		borderWidth: props.noBorder ? 0 : 1,
		width: props.width,
		justifyContent: 'flex-start',
		borderRadius: props.noRadius ? 0 : 5,
		...ifWhitespaces() && { display: "none" },
		...props.flex && { flex: 1 },
		...['number', 'string'].includes(typeof padding) ? { padding: padding } : $Padding(8, 10),
		...props.noBorder && { borderColor: ColorsList.transparent },
		...active ? _activeColor : _color,
		...props.style
	}}>
		{
			['string', 'number'].includes(typeof children) ?
				<Text align="center"
					style={[{ alignSelf: props.align || 'center', color: active ? _activeColor.text : _color.text }, props.textStyle]} {...props.textProps}>
					{children}
				</Text>
				:
				children && <Wrapper {...props.wrapper} {...{ flexStart, flexEnd, center, spaceAround, spaceBetween }} noWrapper={props.noWrapper} flexContent={props.flexContent}>{children}</Wrapper>
		}
	</TouchableOpacity>
	{/* </Animated.View> */ }
}