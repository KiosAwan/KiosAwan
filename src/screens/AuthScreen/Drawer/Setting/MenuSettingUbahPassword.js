import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { } from 'src/components/Input/InputComp';
import { ColorsList } from 'src/styles/colors';
import { Icon } from 'native-base';
import { changePassword, getUserToken } from 'src/utils/authhelper'
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getProfile } from 'src/redux/actions/actionsUserData';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import MDInput, { Input } from 'src/components/Input/MDInput';
import { SizeList } from 'src/styles/size';
import { Text } from 'src/components/Text/CustomText';

const MenuSettingUbahPassword = ({ navigation }) => {
	const PIN = navigation.params ? navigation.params.PIN : undefined
	const User = useSelector(state => state.User)
	const dispatch = useDispatch()

	const [modalVisible, setModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const [formValue, setFormValue] = useState({
		old_password: '',
		new_password: '',
		confirm_new_password: ''
	})
	const [eyes, setEyes] = useState({})

	const inputan = [{
		_label: "Password lama",
		_setEyes: _ => { setEyes({ ...eyes, old_password: !eyes.old_password }) },
		value: formValue.old_password,
		secureTextEntry: !eyes.old_password,
		onChangeText: (text) => { setFormValue({ ...formValue, old_password: text }) }
	}, {
		_label: "Password baru",
		_setEyes: _ => { setEyes({ ...eyes, new_password: !eyes.new_password }) },
		value: formValue.new_password,
		secureTextEntry: !eyes.new_password,
		onChangeText: (text) => { setFormValue({ ...formValue, new_password: text }) }
	}, {
		_label: "Konfirmasi password baru",
		_setEyes: _ => { setEyes({ ...eyes, confirm_new_password: !eyes.confirm_new_password }) },
		value: formValue.confirm_new_password,
		secureTextEntry: !eyes.confirm_new_password,
		onChangeText: (text) => { setFormValue({ ...formValue, confirm_new_password: text }) }
	}]

	const _handleSavePassword = async () => {
		if (formValue.old_password == "" || formValue.new_password == "") {
			setAlertMessage("Password tidak boleh kosong")
			setAlert(true)
		} else if (formValue.new_password != formValue.confirm_new_password) {
			setAlertMessage("Password baru harus sama")
			setAlert(true)
		} else {
			setLoading(true)
			const data = {
				id: User.data.id,
				password: formValue.new_password,
				old_password: formValue.old_password
			}
			const res = await changePassword(data)
			setLoading(false)
			if (res.status == 400) {
				setAlertMessage(res.data.errors.msg)
				setAlert(true)
			} else {
				const userToken = await getUserToken()
				setModalVisible(true)
				setTimeout(() => {
					setModalVisible(false)
					dispatch(getProfile(User.data.id, userToken))
					navigation.navigate('/drawer/settings')
				}, 1000)
			}
		}
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
			><ModalContent
					image={require('src/assets/images/successchangepassword.png')}
					infoText="Password Berhasil Diganti!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<GlobalHeader title="Ubah Password" onPressBack={() => navigation.goBack()} />
			<AwanPopup.Loading visible={loading} />
			<ScrollView showsVerticalScrollIndicator={false} style={{ padding: SizeList.bodyPadding }}>
				{
					inputan.rMap((input, i) => {
						return <View style={styles.floatingInput}>
							<Input key={i} label={input._label} style={{ width: '100%' }} {...input}
								renderRightAccessory={() => <Icon style={{ color: ColorsList.greyFont, fontSize: 20 }} name={input.secureTextEntry ? "eye" : "eye-off"} onPress={input._setEyes} />} />
						</View>
					})
				}
				<View style={{ backgroundColor: ColorsList.settingBg,  borderRadius: SizeList.borderRadius }}>
					<Text style={{ padding: 10 }} color="settingFont">Untuk mengganti password, anda harus memasukkan password anda saat ini</Text>
				</View>
			</ScrollView>
			<Bottom>
				<Button onPress={_handleSavePassword} style={{ width: '100%' }}>SIMPAN</Button>
			</Bottom>
		</View>
	)
}
export default MenuSettingUbahPassword

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: ColorsList.black, borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})