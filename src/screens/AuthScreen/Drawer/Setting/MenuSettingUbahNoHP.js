import React, { useState, useEffect } from "react"
import { View, Modal, StyleSheet } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { SizeList } from "src/styles/size"
import {} from "src/components/Input/InputComp"
import ModalContent from "src/components/ModalContent/ModalContent"
import { changeNewPhoneNumber, getUserToken } from "src/utils/authhelper"
import { phoneValidation } from "src/utils/unauthhelper"
import { getProfile } from "src/redux/actions/actionsUserData"
import { AwanPopup } from "src/components/ModalContent/Popups"
import { Input } from "src/components/Input/MDInput"
import Container, { Footer, Body } from "src/components/View/Container"
import { Button } from "src/components/Button/Button"
const MenuSettingUbahNoHP = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const [newPhoneNum, setNewPhoneNum] = useState()
	const [modalVisible, setModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const _nextBtn = async () => {
		setLoading(true)
		const a = phoneValidation(
			newPhoneNum[0] == 0 ? newPhoneNum.replace("0", "62") : newPhoneNum,
		)
		if (!a) {
			setAlertMessage("Mohon masukkan nomer telfon dengan format yang benar")
			setAlert(true)
		} else {
			const data = {
				id: User.data.id,
				phone_number:
					newPhoneNum[0] == 0 ? newPhoneNum.replace("0", "62") : newPhoneNum,
			}
			const res = await changeNewPhoneNumber(data)
			setLoading(false)
			if (res.status == 400) {
				setAlertMessage(res.data.errors.msg)
				setAlert(true)
			} else if (res.status == 200) {
				const userToken = await getUserToken()
				setModalVisible(true)
				dispatch(getProfile(User.data.id, userToken))
				setTimeout(() => {
					setModalVisible(false)
					navigation.navigate("/")
				}, 800)
			}
		}
	}
	const _handleChangePhone = text => {
		setNewPhoneNum(text)
	}
	return (
		<Container
			header={{
				title: "Ubah No. HP",
				onPressBack: () => navigation.goBack(),
			}}>
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
					setModalVisible(!modalVisible)
				}}>
				<ModalContent
					image={require("src/assets/images/successchangephone.png")}
					infoText="Anda Berhasil Mengubah No HP!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<AwanPopup.Loading visible={loading} />
			<Body>
				<View style={{ marginBottom: SizeList.base }}>
					<Input
						label="Nomor lama anda"
						value={User.data.phone_number}
						editable={false}
					/>
				</View>
				<Input
					label="Masukkan nomor baru anda"
					keyboardType="numeric"
					value={newPhoneNum}
					onChangeText={_handleChangePhone}
				/>
			</Body>
			<Footer>
				<Button onPress={_nextBtn}>SIMPAN</Button>
			</Footer>
		</Container>
	)
}

export default MenuSettingUbahNoHP
