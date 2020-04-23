import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, StyleSheet } from 'react-native';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { useSelector, useDispatch } from 'react-redux'
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { changeNewPhoneNumber, getUserToken } from '../../../../utils/authhelper'
import { phoneValidation } from '../../../../utils/unauthhelper';
import { getProfile } from '../../../../redux/actions/actionsUserData';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import MDInput from 'src/components/Input/MDInput';
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
		const a = phoneValidation(newPhoneNum[0] == 0 ? newPhoneNum.replace("0", "62") : newPhoneNum)
		if (!a) {
			setAlertMessage("Mohon masukkan nomer telfon dengan format yang benar")
			setAlert(true)
		}
		else {
			const data = {
				id: User.data.id,
				phone_number: newPhoneNum[0] == 0 ? newPhoneNum.replace("0", "62") : newPhoneNum
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
					navigation.navigate('/drawer/settings')
				}, 800)
			}
		}
	}
	const _handleChangePhone = (text) => {
		setNewPhoneNum(text)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
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
					image={require('../../../../assets/images/successchangephone.png')}
					infoText="Anda Berhasil Mengubah No HP!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<AwanPopup.Loading visible={loading} />
			<GlobalHeader title="Ubah No. HP" onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 15, backgroundColor: 'white', margin: 30 }}>
				<View>
					<MDInput label="Nomor lama anda" value={User.data.phone_number} editable={false} />
				</View>
				<View>
					<MDInput style={{ marginTop: 30 }} label="Masukkan nomor baru anda"
						keyboardType="numeric"
						value={newPhoneNum} onChangeText={_handleChangePhone} />
				</View>
			</View>

			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
				<BottomButton
					onPressBtn={_nextBtn}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
					buttonTitle="SIMPAN"
				/>
			</View>
		</View>
	)
}

export default MenuSettingUbahNoHP;