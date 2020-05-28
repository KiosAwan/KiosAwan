import React, { useState } from 'react'
import PinView from 'src/components/Input/PinView';
import ModalContent from 'src/components/ModalContent/ModalContent';
import Container from 'src/components/View/Container';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Modal } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { stateObject } from 'src/utils/state';
import { ColorsList } from 'src/styles/colors';
import { changeUserPIN } from 'src/utils/authhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const ChangePINNewPIN = ({ navigation }) => {
	const [params] = stateObject(navigation.state.params)
	const [modalVisible, setModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)
	const _pinTitle = () => {
		let paramsLength = Object.keys(params).length
		return paramsLength == 0 ?
			'Masukkan PIN Lama Anda' :
			paramsLength == 1 ?
				'Masukkan PIN Baru Anda' :
				'Masukkan Kembali PIN Baru Anda'
	}
	const _handlePINFulfilled = code => {
		let route = '/drawer/settings/change-pin/new-pin'
		let paramsLength = Object.keys(params).length
		if (paramsLength == 0) {
			navigation.push(route, {
				old_pin: code
			})
		} else if (paramsLength == 1) {
			navigation.push(route, {
				...params,
				pin: code
			})
		} else if (paramsLength == 2) {
			_handleSavePIN(code)
		}
	}
	const _handleSavePIN = async code => {
		const { old_pin, pin, confirmPin } = { ...params, confirmPin: code }
		if (!pin || !confirmPin) {
			setAlertMessage("Pin harus 4 digit")
			setAlert(true)
		} else if (pin != confirmPin) {
			setAlertMessage("Pin harus sama")
			setAlert(true)
		} else {
			setLoading(true)
			const id = await AsyncStorage.getItem('userId')
			const data = { id, pin, old_pin }
			const res = await changeUserPIN(data)
			console.debug(data)
			setLoading(false)
			if (res.status == 200) {
				setModalVisible(true)
				setTimeout(() => {
					setModalVisible(false)
					navigation.navigate('/drawer/settings')
				}, 1000)
			} else if (res.status == 400) {
				setAlertMessage(res.data.errors.msg)
				setAlert(true)
			}
		}
	}
	return <Container>
		<AwanPopup.Alert
			message={alertMessage}
			visible={alert}
			closeAlert={() => setAlert(false)}
		/>
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(!modalVisible);
			}}
		>
			<ModalContent
				image={require('src/assets/images/successchangepin.png')}
				infoText="Anda Berhasil Mengubah PIN!"
				closeModal={() => setModalVisible(false)}
			/>
		</Modal>
		<AwanPopup.Loading visible={loading} />
		<PinView
			title={
				<View style={{ width: "60%", alignItems: "center" }}>
					<Text style={{ marginBottom: 10 }} size={16}>{_pinTitle()}</Text>
				</View>
			}
			notTransparent
			pinLength={4}
			name="Ubah PIN"
			btnColor={['transparent', 'greyFont']}
			pinColor={ColorsList.authBackground}
			pinActiveColor={ColorsList.primary}
			onPressBack={() => navigation.goBack()}
			onComplete={code => _handlePINFulfilled(code)}
		/>
	</Container>
}

export default ChangePINNewPIN;