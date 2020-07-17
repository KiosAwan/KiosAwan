import React from 'react';
import { Text } from '../Text/CustomText';
import { TouchableOpacity, ViewPropTypes, TextPropTypes } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Wrapper } from '../View/Wrapper';
import { $Padding, $Border } from 'src/utils/stylehelper';
import { SizeList } from 'src/styles/size';
import { shadowStyle } from '../Input/MDInput';
import PropTypes from 'prop-types'

const BtnColorsObj = {
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
		backgroundColor: ColorsList.informationBg,
		text: ColorsList.informationFont
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
		text: ColorsList.primary
	},
	linkBorder: {
		borderColor: ColorsList.borderColor,
		backgroundColor: ColorsList.transparent,
		text: ColorsList.primary
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
	},
	grey: {
		borderColor: ColorsList.borderColor,
		backgroundColor: ColorsList.borderColor,
		text: ColorsList.whiteColor
	},
	topupActive: {
		borderColor: ColorsList.borderColor,
		backgroundColor: ColorsList.whiteColor,
		text: ColorsList.whiteColor
	}
}

const Button = props => {
	const { flexStart, flexEnd, center, spaceAround, spaceBetween } = props
	const {
		active,
		activeColor,
		align,
		borderBottom,
		children,
		color,
		flex,
		flexContent,
		height,
		hideIfEmpty,
		justify,
		marginHorizontal,
		noBorder,
		noRadius,
		noWrapper,
		padding,
		radius,
		style,
		textProps,
		textStyle,
		width,
		wrapper,
	} = props
	let Colors = BtnColorsObj
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
				...$Border(backgroundColor, 0, 0, 1, 0)
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
			hideIfEmpty
		) {
			return true
		}
		return false
	}
	return <TouchableOpacity activeOpacity={.5} {...props} style={{
		borderWidth: noBorder ? 0 : 1,
		width, height, marginHorizontal,
		justifyContent: justify || 'flex-start',
		borderRadius: noRadius ? 0 : radius || 20, ...ifWhitespaces() && { display: "none" },
		...flex && { flex: 1 },
		...['number', 'string'].includes(typeof padding) ? { padding: padding } : $Padding(8, 10),
		...noBorder && { borderColor: ColorsList.borderColor },
		...active ? _activeColor : _color,
		...style
	}}>
		{
			['string', 'number'].includes(typeof children) ?
				<Text align="center"
					font="SemiBold"
					color={active ? _activeColor.text : _color.text}
					style={{
						alignSelf: align || 'center',
						...textStyle
					}} {...textProps}>
					{children}
				</Text>
				:
				children && <Wrapper {...wrapper} {...{ flexStart, flexEnd, center, spaceAround, spaceBetween }} noWrapper={noWrapper} flexContent={flexContent}>{children}</Wrapper>
		}
	</TouchableOpacity>
}

const Info = props => <Button
	disabled
	align="flex-start"
	textProps={{ align: "left" }}
	radius={SizeList.borderRadius}
	{...props}
/>

const ButtonShadow = props => {
	const { children, onPress, style } = props
	return <TouchableOpacity onPress={onPress}>
		<Wrapper shadow {...props} style={{
			borderRadius: 50,
			padding: SizeList.base,
			backgroundColor: ColorsList.white,
			borderRadius: 20,
			...style
		}}>{children}</Wrapper>
	</TouchableOpacity>
}

const RoundedButton = props => {
	const { size, style, children, textProps } = props
	return <TouchableOpacity {...props} style={{
		...shadowStyle,
		justifyContent: 'center',
		alignItems: 'center',
		width: size || 50,
		height: size || 50,
		borderRadius: 50,
		...style
	}}>
		{
			['string', 'number'].includes(typeof children) ?
				<Text {...textProps}>{children}</Text> :
				children
		}
	</TouchableOpacity>
}

const colorType = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.oneOf(Object.keys(BtnColorsObj)),
	PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(BtnColorsObj))
		])
	)
])

Button.propTypes = {
	color: colorType,
	activeColor: colorType,
	active: PropTypes.bool,
	align: PropTypes.string,
	borderBottom: PropTypes.number,
	flex: PropTypes.bool,
	flexContent: PropTypes.bool,
	height: PropTypes.number,
	hideIfEmpty: PropTypes.bool,
	justify: PropTypes.string,
	marginHorizontal: PropTypes.number,
	noBorder: PropTypes.bool,
	noRadius: PropTypes.bool,
	noWrapper: PropTypes.bool,
	padding: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.shape({
			paddingBottom: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.string
			]),
			paddingLeft: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.string
			]),
			paddingRight: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.string
			]),
			paddingTop: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.string
			])
		})
	]),
	radius: PropTypes.number,
	style: ViewPropTypes.style,
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	]),
	textStyle: Text.propTypes.style,
	children: PropTypes.any,
	textProps: PropTypes.shape(Text.propTypes),
	wrapper: PropTypes.shape(Wrapper.propTypes)
}

RoundedButton.propTypes = {
	size: PropTypes.number,
	style: ViewPropTypes.style,
	textProps: Text.propTypes,
	children: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.element
	])
}

Info.propTypes = {
	color: Button.propTypes.color,
	style: ViewPropTypes.style
}

export { Button, Info, ButtonShadow, RoundedButton }