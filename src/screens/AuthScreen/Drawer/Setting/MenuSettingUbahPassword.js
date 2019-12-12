import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker'
import { useDispatch } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { Text } from '../../../../components/Text/CustomText';
import { Icon } from 'native-base';

const MenuSettingUbahPassword = ({ navigation }) => {
	const dispatch = useDispatch()

	const [enableSave, setEnableSave] = useState(false)
	const [formValue, setFormValue] = useState({})
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
		if (enableSave) {
			console.debug(formValue)
			// const id_user = await AsyncStorage.getItem('userId')
			// const formData = new FormData()
			// formData.appendObject(formValue, ['photo_store']) // ('Form data yang di append', 'kecuali')
			// formData.append('photo_store', formValue.photo_store != "" ? {
			// 	uri: formValue.photo_store,
			// 	type: "image/jpeg",
			// 	name: `${Date.now()}.jpeg`
			// } : null)
			// if (res.status == 400) {
			// 	alert(res.data.errors.msg)
			// } else {
			// 	await dispatch(getProfile(id_user))
			// 	navigation.navigate('Home')
			// }
			setEnableSave(false)
		} else {
			setEnableSave(true)
		}
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Update Profil" onPressBack={() => navigation.goBack()} />
			<ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
				<View style={{ paddingVertical: 30, paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
					{
						inputan.map((input, i) => {
							return <FloatingInput key={i} style={styles.floatingInput} label="kjasdhhd">
								<TextInput style={{ width: '90%' }} {...input} />
								<Icon name={input.secureTextEntry ? "eye" : "eye-off"} onPress={input._setEyes} />
							</FloatingInput>
						})
					}
				</View>
				<View>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity onPress={_handleChoosePhoto} style={{ backgroundColor: 'white' }}>
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
const Wow = props => {
	let _input, inIndex
	if (props.children) {
		if (Array.isArray(props.children)) {
			props.children.forEach((prop, i) => {
				if ('value' in prop.props) {
					inIndex = i
					_input = prop
				}
			})
		} else {
			_input = props.children
		}
	} else {
		throw new Error('Kasih children dong, gw mau nampilin apaan nih kalo ga lu kasih?');
	}
	if (!('value' in _input.props)) {
		throw new Error('Tolong ya mas, Input nya di kasih value, Fungsi Input kan buat store data. Apa yang mau di store kalo ga ada value');
	} else {
	}
	// console.debug(_input)
	// console.debug(child)
	return <View></View>
}
export default MenuSettingUbahPassword

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})