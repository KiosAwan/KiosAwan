import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { View, StyleSheet, Image, TextInput, Modal } from 'react-native';
import { GlobalHeader } from '../../../components/Header/Header';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Text } from '../../../components/Text/CustomText';
import { ColorsList } from '../../../styles/colors';
import { FloatingInput } from '../../../components/Input/InputComp';
import { BottomButton } from '../../../components/Button/ButtonComp';
import { SizeList } from '../../../styles/size';
import ImagePicker from 'react-native-image-crop-picker'
import AsyncStorage from '@react-native-community/async-storage';
import { sendProfileData } from '../../../utils/authhelper';
import { getProfile } from '../../../redux/actions/actionsUserData';
import ModalContent from '../../../components/ModalContent/ModalContent';


const UpdateProfil = ({ navigation }) => {
	const dispatch = useDispatch()

	const [modalVisible, setModalVisible] = useState(false)
	const [name_store, setName_Store] = useState('')
	const [email_store, setEmail_Store] = useState('')
	const [photo_store, setPhotoStore] = useState('')
	const [address_store, setAddress_Store] = useState()
	const inputan = [{
		label: "Email",
		value: email_store,
		handleChangeText: (text) => { setEmail_Store(text) }
	},
	{
		label: "Nama toko / kios",
		value: name_store,
		handleChangeText: (text) => { setName_Store(text) }
	}, {
		label: "Alamat toko / kios",
		value: address_store,
		handleChangeText: (text) => { setAddress_Store(text) }
	}]

	const _handleChoosePhoto = () => {
		ImagePicker.openCamera({
			width: 300,
			height: 300,
			cropping: true
		}).then(image => {
			setPhotoStore(image.path)
		});
	};

	const _handleSaveProfile = async () => {
		const id_user = await AsyncStorage.getItem('userId')
		const formData = new FormData()
		formData.append("id_user", id_user)
		formData.append("name_store", name_store)
		formData.append("email_store", email_store)
		formData.append("address_store", address_store)
		formData.append('photo_store', photo_store != "" ? {
			uri: photo_store,
			type: "image/jpeg",
			name: `${Date.now()}.jpeg`
		} : null)
		const res = await sendProfileData(formData)
		if (res.status == 400) {
			alert(res.data.errors.msg)
		} else {
			setModalVisible(true)
			setTimeout(() => {
				setModalVisible(false)
				dispatch(getProfile(id_user))
				navigation.navigate('Home')
			}, 1000)

		}

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
					image={require('../../../assets/images/successcreatestore.png')}
					infoText="Pembaruan Profil Berhasil!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<GlobalHeader title="Update Profil" onPressBack={() => navigation.goBack()} />
			<ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
				<View style={{ paddingVertical: 30, paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
					{
						inputan.map((input, i) => {
							return <FloatingInput key={i} style={styles.floatingInput} label={input.label}>
								<TextInput onChangeText={input.handleChangeText} value={input.value} />
							</FloatingInput>
						})
					}
				</View>
				<View style={{ marginBottom: 70 }}>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity onPress={_handleChoosePhoto} style={{ backgroundColor: 'white' }}>
							<Image style={styles.image} source={photo_store ? { uri: photo_store } : require('../../../assets/images/img-product.png')} />
						</TouchableOpacity>
					</View>
				</View>

			</ScrollView>
			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
				<BottomButton
					onPressBtn={_handleSaveProfile}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
					buttonTitle="SIMPAN"
				/>
			</View>
		</View>
	)
}

export default UpdateProfil

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})