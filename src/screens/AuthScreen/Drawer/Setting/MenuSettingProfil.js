import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { Text } from '../../../../components/Text/CustomText';

const MenuSettingProfil = ({ navigation }) => {
	const dispatch = useDispatch()

	const User = useSelector(state => state.User)
	console.debug(User)
	const [enableSave, setEnableSave] = useState(true)
	const [formValue, setFormValue] = useState({
		nama: User.data.name,
		email_store: User.store.email_store,
		no_telp: User.data.phone_number,
		name_store: User.store.name_store,
		photo_store: User.store.photo_store,
		address_store: User.store.address_store
	})

	const inputan = [{
		_label: "Nama",
		value: formValue.nama,
		onChangeText: (text) => { setFormValue({ ...formValue, nama: text }) }
	}, {
		_label: "Email",
		value: formValue.email_store,
		keyboardType: 'email',
		onChangeText: (text) => { setFormValue({ ...formValue, email_store: text }) }
	}, {
		_label: "No. telepon",
		value: formValue.no_telp,
		keyboardType: 'numeric',
		onChangeText: (text) => { setFormValue({ ...formValue, no_telp: text }) }
	},
	{
		_label: "Nama toko / kios",
		value: formValue.name_store,
		onChangeText: (text) => { setFormValue({ ...formValue, name_store: text }) }
	}, {
		_label: "Alamat toko / kios",
		value: formValue.address_store,
		onChangeText: (text) => { setFormValue({ ...formValue, address_store: text }) }
	}]

	const _handleChoosePhoto = () => {
		ImagePicker.openCamera({
			width: 300,
			height: 300,
			cropping: true
		}).then(image => {
			setFormValue({ ...formValue, photo_store: image.path })
		});
	};

	const _handleSaveProfile = async () => {
		// if (enableSave) {
		const id_user = await AsyncStorage.getItem('userId')
		const formData = new FormData()
		formData.appendObject(formValue, ['photo_store']) // ('Form data yang di append', 'kecuali')
		formData.append('photo_store', formValue.photo_store != "" ? {
			uri: formValue.photo_store,
			type: "image/jpeg",
			name: `${Date.now()}.jpeg`
		} : null)
		console.debug(formData)
		// if (res.status == 400) {
		// 	alert(res.data.errors.msg)
		// } else {
		// 	await dispatch(getProfile(id_user))
		// 	navigation.navigate('Home')
		// }
		// 	setEnableSave(false)
		// } else {
		// 	setEnableSave(true)
		// }
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Update Profil" onPressBack={() => navigation.goBack()} />
			<ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
				<View style={{ paddingVertical: 30, paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
					{
						inputan.map((input, i) => {
							return <FloatingInput key={i} style={styles.floatingInput} label={input._label}>
								<TextInput editable={enableSave} {...input} />
							</FloatingInput>
						})
					}
				</View>
				<View>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity disabled={!enableSave} onPress={_handleChoosePhoto} style={{ backgroundColor: 'white' }}>
							<Image style={styles.image} source={formValue.photo_store ? { uri: formValue.photo_store } : require('../../../../assets/images/img-product.png')} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
					<BottomButton
						onPressBtn={_handleSaveProfile}
						style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
						buttonTitle={enableSave ? "SIMPAN" : "UBAH"}
					/>
				</View>
			</ScrollView>
		</View>
	)
}

export default MenuSettingProfil

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})