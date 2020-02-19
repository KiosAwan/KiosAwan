import React, { useState } from 'react';
import { View, Modal as ModalRN, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '../Text/CustomText'
import { ColorsList } from '../../styles/colors';
import { SizeList } from '../../styles/size';
import LinearGradient from 'react-native-linear-gradient';
import { $Padding } from 'src/utils/stylehelper';
import { Button } from '../Button/Button';
import Divider from '../Row/Divider';

const Modal = (props) => {
	const styles = StyleSheet.create({
		modalBackDrop: { alignItems: 'center', justifyContent: 'center', backgroundColor: props.transparent ? 'transparent' : 'rgba(0,0,0,.5)', width: '100%', height: '100%' },
		modalView: {
			...$Padding(5, 0),
			backgroundColor: props.transparent ? 'transparent' : ColorsList.whiteColor,
			maxHeight: '50%',
			maxWidth: '90%'
		}
	})
	return (
		<ModalRN
			animationType={props.animation || 'slide'}
			transparent={true}
			{...props}>
			<TouchableOpacity activeOpacity={1} style={styles.modalBackDrop} disabled={!props.backdropDismiss ? true : false} onPress={!props.backdropDismiss ? null : props.backdropDismiss}>
				{/* <TouchableOpacity activeOpacity={1} onPress={() => { }} style={[styles.modalView, props.style]}>{props.children}</TouchableOpacity> */}
				{/* {props.children} */}
				<TouchableOpacity activeOpacity={1} style={[styles.modalView, props.style]}>
					{props.children}
				</TouchableOpacity>
			</TouchableOpacity>
		</ModalRN>
	)
}

const AwanPopup = {
	Title: props => {
		return <Modal animationType="fade" style={{ padding: 0 }} {...props}>
			<View style={[styles.body, props.style]}>
				{typeof props.title === 'string' ? <Text color={props.textColor} font="Bold" size={17} style={styles.title}>{props.title.toUpperCase()}</Text> : props.title}
				<Text color={props.textColor} size={17} style={{ textAlign: 'center' }}>{props.message}</Text>
				<ButtonWrapper>{props.children}</ButtonWrapper>
			</View>
		</Modal>
	},
	NoTitle: props => {
		return <Modal animationType="fade" style={{ padding: 0 }} {...props}>
			<View style={styles.body}>
				<Text size={17} style={{ textAlign: 'center' }}>{props.message}</Text>
				<ButtonWrapper>{props.children}</ButtonWrapper>
			</View>
		</Modal>
	},
	Menu: props => {
		return <Modal {...props} animationType="fade" style={[styles.shadow, {
			padding: 0, minWidth: '70%', position: props.absolute ? 'absolute' : undefined
		}, props.style]}>
			{!props.noTitle && <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]}>
				<Text font="Bold" size={props.titleSize || 15} style={{ color: ColorsList.whiteColor, ...$Padding(10, 15) }}>
					{props.title.toUpperCase()}
				</Text>
			</LinearGradient>}
			<View style={[{ padding: 5 }, props.noTitle ? { borderRadius: 5 } : {}, props.contentStyle]}>
				{
					props.children.length > 0 ?
						props.children.map((child, i) => {
							return [
								child,
								!props.noTitle && props.children.length - 1 != i ? <Divider /> : null
							]
						})
						: props.children
				}
			</View>
		</Modal>
	},
	Loading: props => {
		return <Modal {...props} animationType="fade" style={{ backgroundColor: ColorsList.transparent, padding: 0 }}>
			<View style={{ borderRadius: 15, backgroundColor: ColorsList.whiteColor, padding: 15 }}>
				<Image source={require('../../assets/modals/spinner.gif')}
					style={[styles.image, { width: 50, height: 50 }]}
					resizeMode="stretch" />
			</View>
		</Modal>
	},
	Alert: props =>
		<Modal animationType="fade" style={{ padding: 0, width: SizeList.width * 2 / 3 }} {...props}>
			<View style={[styles.body, props.style]}>
				<Image source={require('../../assets/icons/circlereject.png')}
					style={[styles.image, { width: 50, height: 50 }]}
					resizeMode="stretch" />
				<Text size={17} style={{ textAlign: 'center', paddingTop: 20, }}>Oops...</Text>
				<View style={{ width: '80%', alignItems: "center" }}>
					<Text size={17} style={{ textAlign: 'center', paddingTop: 20, }}>{props.message}</Text>
				</View>
				<ButtonWrapper style={{ justifyContent: "center" }}>
					<Button color="white" width='50%' onPress={props.closeAlert}>OK</Button>
				</ButtonWrapper>
			</View>
		</Modal>
}

const ButtonWrapper = props => {
	return <View style={[styles.buttonWrapper, props.style]}>{props.children}</View>
}
export { Modal, AwanPopup }
const styles = StyleSheet.create({
	shadow: {
		shadowColor: ColorsList.greySoft,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,
		elevation: 24,
	},
	buttonWrapper: { marginTop: 30, alignSelf: 'flex-end', flexDirection: 'row' },
	image: { alignSelf: 'center', height: 100, width: '100%' },
	title: { textAlign: 'center', padding: 20 },
	oldTitle: { position: 'absolute', top: 90, alignSelf: 'center', color: ColorsList.whiteColor },
	body: { ...$Padding(10, 15, 20), backgroundColor: ColorsList.whiteColor, alignItems: "center" }
})