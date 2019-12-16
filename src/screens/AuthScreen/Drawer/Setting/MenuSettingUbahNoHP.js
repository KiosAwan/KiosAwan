import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, StyleSheet } from 'react-native';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { useSelector, useDispatch } from 'react-redux'
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { FloatingInput } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { changeNewPhoneNumber } from '../../../../utils/authhelper'
import { phoneValidation } from '../../../../utils/unauthhelper';
import { getProfile } from '../../../../redux/actions/actionsUserData';
const MenuSettingUbahNoHP = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const [newPhoneNum, setNewPhoneNum] = useState()
	const [modalVisible, setModalVisible] = useState(false)

	const _nextBtn = async () => {
		const a = phoneValidation(newPhoneNum[0] == 0 ? newPhoneNum.replace("0", "62") : newPhoneNum)
		if (!a) {
			alert("Mohon masukkan nomer telfon dengan format yang benar")
		}
		else {
			const data = {
				id: User.data.id,
				phone_number: newPhoneNum[0] == 0 ? newPhoneNum.replace("0", "62") : newPhoneNum
			}
			const res = await changeNewPhoneNumber(data)
			if (res.status == 400) {
				alert(res.data.errors.msg)
			} else if (res.status == 200) {
				setModalVisible(true)
				dispatch(getProfile(User.data.id))
				setTimeout(() => {
					setModalVisible(false)
					navigation.navigate('MenuSetting')
				}, 800)
			}
		}
	}
	const _handleChangePhone = (text) => {
		setNewPhoneNum(text)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<ModalContent
					image={require('../../../../assets/images/createpinsuccess.png')}
					infoText="Anda Berhasil Mengubah No HP!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<GlobalHeader title="Ubah No. HP" onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 15, backgroundColor: 'white', margin: 30 }}>
				<View>
					<FloatingInput label="Nomor lama anda">
						<TextInput value={User.data.phone_number} editable={false} />
					</FloatingInput>
				</View>
				<View>
					<FloatingInput style={{ marginTop: 30 }} label="Masukkan nomor baru anda">
						<TextInput
							keyboardType="numeric"
							value={newPhoneNum} onChangeText={_handleChangePhone} />
					</FloatingInput>
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