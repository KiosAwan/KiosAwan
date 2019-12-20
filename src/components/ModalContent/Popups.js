import React, { useState } from 'react';
import { View, Modal as ModalRN, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MyModal } from "../Picker/SelectBoxModal";
import { Text } from '../Text/CustomText'
import { CardItem } from 'native-base';
import { ColorsList } from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Bottom } from '../Button/ButtonComp';

export const Modal = (props) => {
	const styles = StyleSheet.create({
		modalBackDrop: { alignItems: 'center', justifyContent: 'center', backgroundColor: props.transparent ? 'transparent' : 'rgba(0,0,0,.5)', width: '100%', height: '100%' },
		modalView: { backgroundColor: ColorsList.whiteColor, maxWidth: '80%', justifyContent: "center", padding: 20 }
	})
	return (
		<ModalRN
			animationType="slide"
			transparent={true}
			{...props}>
			<TouchableOpacity style={styles.modalBackDrop} disabled={!props.backdropDismiss ? true : false} onPress={!props.backdropDismiss ? null : props.backdropDismiss}>
				<TouchableOpacity activeOpacity={1} onPress={() => { }} style={[styles.modalView, props.style]}>{props.children}</TouchableOpacity>
			</TouchableOpacity>
		</ModalRN>
	)
}

export const AwanPopup = {
	Title: props => {
		return <Modal animationType="fade" style={{ padding: 0 }} {...props}>
			<LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]}>
				<Image source={require('../../assets/modals/awan-little.png')}
					style={styles.image}
					resizeMode="stretch" />
				<Image source={require('../../assets/modals/awan.png')}
					style={styles.image}
					resizeMode="stretch" />
				<Text font="Bold" size={30} style={styles.title}>{props.title.toUpperCase()}</Text>
			</LinearGradient>
			<View style={styles.body}>
				<Text size={17} style={{ textAlign: 'center' }}>{props.message}</Text>
			</View>
			<Bottom>
				{props.children}
			</Bottom>
		</Modal>
	},
	NoTitle: props => {
		return <Modal animationType="fade" style={{ padding: 0 }} {...props}>
			<LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]}>
				<Image source={require('../../assets/modals/awan-little.png')}
					style={styles.image}
					resizeMode="stretch" />
				<Image source={require('../../assets/modals/store.png')}
					style={[styles.image, { position: 'absolute', bottom: 10, height: 150, left: 0, width: '70%' }]}
					resizeMode="stretch" />
				<Image source={require('../../assets/modals/awan.png')}
					style={styles.image}
					resizeMode="stretch" />
			</LinearGradient>
			<View style={styles.body}>
				<Text size={17} style={{ textAlign: 'center' }}>{props.message}</Text>
			</View>
			<Bottom>
				{props.children}
			</Bottom>
		</Modal>
	},
	Menu: props => {
		return <Modal animationType="fade" transparents style={[styles.shadow, {
			padding: 0, minWidth: 350, position: 'absolute'
		}, props.position]} {...props}>
			<LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]}>
				<Text font="Bold" size={20} style={{ color: ColorsList.whiteColor, padding: 15 }}>
					{props.title.toUpperCase()}
				</Text>
				<Image source={require('../../assets/modals/awan-corner.png')}
					style={[styles.image, { position: 'absolute', right: 0, width: '30%' }]}
					resizeMode="stretch" />
			</LinearGradient>
			<View style={{ padding: 15 }}>
				{props.children}
			</View>
		</Modal>
	},
	Loading: props => {
		return <Modal animationType="fade" style={{ backgroundColor: ColorsList.transparent, padding: 0 }} {...props}>
			{/* <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]}>
				<Image source={require('../../assets/modals/awan-little.png')}
					style={styles.image}
					resizeMode="stretch" />
				<View style={{ paddingHorizontal: 20, backgroundColor: ColorsList.transparent }}>
					<Text size={18} color="whiteColor" style={{ textAlign: 'center' }} font="Bold">{'Harap tunggu'.toUpperCase()}</Text>
					<Text color="whiteColor" style={{ textAlign: 'center' }} font="Bold">Aplikasi sedang memproses</Text>
				</View>
				<Image source={require('../../assets/modals/awan.png')}
					style={styles.image}
					resizeMode="stretch" />
			</LinearGradient> */}
			<View style={{ borderRadius: 15, backgroundColor: ColorsList.whiteColor, padding: 15 }}>
				<Image source={require('../../assets/modals/spinner.gif')}
					style={[styles.image, { width: 50, height: 50 }]}
					resizeMode="stretch" />
			</View>
		</Modal>
	}
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
	image: { alignSelf: 'center', height: 100, width: '100%' },
	title: { position: 'absolute', top: 90, alignSelf: 'center', color: ColorsList.whiteColor },
	body: { minHeight: 150, paddingHorizontal: 15, paddingBottom: 75, backgroundColor: ColorsList.whiteColor }
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