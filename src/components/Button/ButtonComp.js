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