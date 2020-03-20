import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { } from '../../../../components/Input/InputComp';
import { ColorsList } from '../../../../styles/colors';
import { Icon } from 'native-base';
import { changePassword } from '../../../../utils/authhelper'
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { getProfile } from '../../../../redux/actions/actionsUserData';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import MDInput from 'src/components/Input/MDInput';

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
				setModalVisible(true)
				setTimeout(() => {
					setModalVisible(false)
					dispatch(getProfile(User.data.id))
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
					image={require('../../../../assets/images/successchangepassword.png')}
					infoText="Password Berhasil Diganti!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<GlobalHeader title="Ubah Password" onPressBack={() => navigation.goBack()} />
			<AwanPopup.Loading visible={loading} />
			<ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
				<View style={{ paddingVertical: 30, paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
					{
						inputan.map((input, i) => {
							return <MDInput key={i} style={styles.floatingInput} label={input._label} style={{ width: '90%' }} {...input}
								renderRightAccessory={() => <Icon name={input.secureTextEntry ? "eye" : "eye-off"} onPress={input._setEyes} />} />
						})
					}
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
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})