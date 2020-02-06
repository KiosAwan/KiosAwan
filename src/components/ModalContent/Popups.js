import React, { useState } from 'react';
import { View, Modal as ModalRN, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '../Text/CustomText'
import { ColorsList } from '../../styles/colors';
import { SizeList } from '../../styles/size';
import LinearGradient from 'react-native-linear-gradient';
import { $Padding } from 'src/utils/stylehelper';
import { Button } from '../Button/Button';
import Divider from '../Row/Divider';

export const Modal = (props) => {
	const styles = StyleSheet.create({
		modalBackDrop: { alignItems: 'center', justifyContent: 'center', backgroundColor: props.transparent ? 'transparent' : 'rgba(0,0,0,.5)', width: '100%', height: '100%' },
		modalView: { backgroundColor: props.transparent ? 'transparent' : ColorsList.whiteColor, maxWidth: '90%', justifyContent: "center", padding: 20 }
	})
	return (
		<ModalRN
			animationType={props.animation || 'slide'}
			transparent={true}
			{...props}>
			<TouchableOpacity activeOpacity={1} style={styles.modalBackDrop} disabled={!props.backdropDismiss ? true : false} onPress={!props.backdropDismiss ? null : props.backdropDismiss}>
				<TouchableOpacity activeOpacity={1} onPress={() => { }} style={[styles.modalView, props.style]}>{props.children}</TouchableOpacity>
			</TouchableOpacity>
		</ModalRN>
	)
}

export const AwanPopup = {
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
		return <Modal {...props} animationType="fade" transparents style={[styles.shadow, {
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



// const [visible, setVisible] = useState(false)

{/* <AwanPopup.Title title="A Simple Dialog" backdropDismiss={() => setVisible(false)} visible={visible} message="
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.">
<Button style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Test</Button>
<View></View>
<Button style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Test</Button>
<Button style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Test</Button>
</AwanPopup.Title> */}

{/* <AwanPopup.NoTitle backdropDismiss={() => setVisible(false)} visible={visible} message="
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo">
<View style={{width:'40%'}}></View>
<Button style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Test</Button>
<Button style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Test</Button>
</AwanPopup.NoTitle> */}


{/* const [position, setPosition] = useState(false)

const _testClick = (e) => {
console.log(e.nativeEvent)
let pos = {
top: e.nativeEvent.pageY,
left: e.nativeEvent.pageX
}
setPosition(pos)
setVisible(true)
}
<AwanPopup.Menu position={position} title="A Simple Dialog" backdropDismiss={() => setVisible(false)} visible={visible} message="
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo">
<View style={{width:'40%'}}></View>
<Button color="link" textProps={{ size: 15, font: 'Bold' }}>Test</Button>
<Button textProps={{ size: 15, font: 'Bold' }}>Test</Button>
</AwanPopup.Menu>
<Button onPress={_testClick}>Test</Button> */}