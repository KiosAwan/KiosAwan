import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Dimensions, StyleSheet, View, Image } from 'react-native'
import {
	Button as ButtonNB
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography'
import { ColorsList } from '../../styles/colors'
import { RowChild } from '../Helper/RowChild'
import { SizeList } from '../../styles/size'
import { Text } from '../Text/CustomText'


const width = Dimensions.get('window').width

export const RegisterButton = (props) => {
	return (
		<ButtonNB primary style={[styles.btn, props.style]}
			disabled={props.disabled}
			onPress={props.onPressBtn}
		>
			<Text>{props.buttonTitle}</Text>
		</ButtonNB>
	)
}

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

export const Wrapper = props => {
	return <View style={[{ flexDirection: props.direction || 'row', justifyContent: props.justify || 'space-around' }, props.style]}>
		{
			props.children.length > 0 ?
				props.children.map((item, i) =>
					<View style={{ width: item.props._width, justifyContent: 'center', ...item.props._style }} key={i}>
						{item}
					</View>
				) : props.children
		}
	</View>
}

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

export const BottomButton = (props) => {
	return (
		<ButtonNB
			primary
			disabled={props.disabled}
			onPress={props.onPressBtn}
			style={[{ width: width - 30, justifyContent: "center", backgroundColor: 'transparent', borderRadius: 5 }, props.style]}
		>
			{props.content ? props.content :
				<Text style={[props.disabled ? { color: '#cd0192' } : { color: 'white' }, props.textStyle]}>{props.buttonTitle}</Text>
			}
		</ButtonNB>
	)
}

export const ButtonWithIcon = (props) => {
	return (
		<TouchableOpacity onPress={props.onPressBtn}>
			<View style={[props.style, { borderRadius: 5, ...RowChild, padding: 8 }]} >
				<Icon color={ColorsList.primaryColor} size={14} style={{ marginRight: 5 }} name={props.iconName} />
				<Text style={[styles.btnwithIconText, props.fontStyle]}>{props.buttonTitle}</Text>
			</View>
		</TouchableOpacity>
	)
}

export const TouchableImage = (props) => {
	return (
		<TouchableOpacity onPress={props.onPressBtn} style={{ width: '100%' }}>
			<Image style={styles.imageButtonNB} source={{ uri: props.image }} />
		</TouchableOpacity>
	)
}
const styles = StyleSheet.create({
	btn: {
		justifyContent: "center",
		width: width * 3 / 4,
		alignSelf: 'center',
		borderRadius: 5,
		backgroundColor: ColorsList.primaryColor
	},
	btnwithIconText: {
		...FontList.titleFont,
		fontSize: 12,
		color: ColorsList.primaryColor,
	},
	imageButtonNB: {
		width: SizeList.width / 4,
		height: 60,
		alignSelf: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#c0c0c0'
	}
})