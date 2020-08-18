import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
	View,
	StyleSheet,
	Dimensions,
	Modal
} from 'react-native';
import BarStatus from 'src/components/BarStatus';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList, infoColorSetting } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { verifyUserPassword, changeUserPIN } from 'src/utils/authhelper';
import { Icon } from 'native-base';
import { Input } from 'src/components/Input/MDInput';
import Container, { Body } from 'src/components/View/Container';
import { Bottom } from 'src/components/View/Bottom';
import { Button, Info } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import { stateObject } from 'src/utils/state';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { openPin } from 'src/utils/pin-otp-helper';
import Storage from 'src/utils/keyStores';


const height = Dimensions.get('window').height

const ChangePINInputPwd = ({ navigation }) => {
	const dispatch = useDispatch()
	const [password, setPassword] = useState()
	const [secure, setSecure] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [alert, setAlert] = stateObject({ visible: false, loading: false, modal: false })
	const User = useSelector(state => state.User)

	const _handleNextBtn = async () => {
		setIsLoading(true)
		const data = { phone_number: User.data.phone_number, password }
		const res = await verifyUserPassword(data)
		setIsLoading(false)
		if (res.status == 200) {
			openNewPin1()
			// navigation.navigate('/drawer/settings/change-pin/new-pin')
		} else if (res.status == 400) {
			setAlert({ visible: true, message: res.data.errors.msg })
		}
	}

	const _handleSavePIN = async ({ old_pin, pin, confirmPin }) => {
		if (!pin || !confirmPin) {
			setAlert({ message: "Pin harus 4 digit", visible: true })
		} else if (pin != confirmPin) {
			setAlert({ message: "Pin harus sama", visible: true })
		} else {
			setAlert({ loading: true })
			const id = await Storage.getItem('userId')
			const data = { id, pin, old_pin }
			const res = await changeUserPIN(data)
			setAlert({ loading: false })
			if (res.status == 200) {
				setAlert({ modal: true })
				setTimeout(() => {
					setAlert({ modal: false })
					navigation.navigate('/drawer/settings')
				}, 1000)
			} else if (res.status == 400) {
				setAlert({ message: res.data.errors.msg, visible: true })
			}
		}
	}

	const openNewPin1 = async () => {
		openPin({
			navigation: navigation.push,
			title: "Ubah PIN",
			textTitle: "Masukkan PIN anda saat ini",
			footer: null,
			onResolve: async oldPin => {
				await Storage.setItem("gantiPin_pinOld", oldPin)
				openNewPin2()
			}
		})
	}
	const openNewPin2 = () => {
		openPin({
			navigation: navigation.push,
			title: "Ubah PIN",
			textTitle: "Masukkan PIN baru anda",
			footer: null,
			onResolve: async pin => {
				await Storage.setItem("gantiPin_pin", pin)
				openNewPin3()
			}
		})
	}
	const openNewPin3 = () => {
		openPin({
			navigation: navigation.push,
			title: "Ubah PIN",
			textTitle: "Ulangi masukkan PIN baru anda",
			footer: null,
			onResolve: async confirmPin => {
				const old_pin = await Storage.getItem("gantiPin_pinOld")
				const pin = await Storage.getItem("gantiPin_pin")
				if (pin == confirmPin) {
					_handleSavePIN({ old_pin, pin, confirmPin })
				} else {
					setAlert({ visible: true, message: "Pin harus sama" })
				}
			}
		})
	}

	return <Container header={{
		onPressBack: () => navigation.goBack(),
		title: "Ubah PIN"
	}}>
		<BarStatus />
		<AwanPopup.Alert
			message={alert.message}
			visible={alert.visible}
			closeAlert={() => setAlert({ visible: false })}
		/>
		<Modal
			animationType="fade"
			transparent={true}
			visible={alert.modal}>
			<ModalContent
				image={require('src/assets/images/successchangepin.png')}
				infoText="Anda Berhasil Mengubah PIN!"
				closeModal={() => setAlert({ modal: false })}
			/>
		</Modal>
		<AwanPopup.Loading visible={alert.loading} />
		<Body>
			<View style={{ alignItems: "center" }}>
				<Input label="Password" value={password}
					secureTextEntry={secure}
					onChangeText={(text) => setPassword(text)}
					renderRightAccessory={() => <Icon onPress={() => setSecure(!secure)} name={secure ? 'eye' : 'eye-off'} style={{ color: ColorsList.greySoft }} />}
				/>
				<Info color={infoColorSetting} style={{ marginVertical: SizeList.padding }}>Untuk mengganti PIN, anda harus memasukkan password saat ini</Info>
			</View>
		</Body>
		<Bottom>
			<Button disabled={isLoading} onPress={_handleNextBtn} width="100%">UBAH</Button>
		</Bottom>
	</Container>
}

export default ChangePINInputPwd