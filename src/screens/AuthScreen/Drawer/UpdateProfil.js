import Wilayah from 'src/utils/wilayah';
import React, { useState, useEffect } from 'react';
import ModalContent from 'src/components/ModalContent/ModalContent';
import MDInput, { Input } from 'src/components/Input/MDInput';
import Container, { Footer, Body } from 'src/components/View/Container';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Image, Modal, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'src/components/Text/CustomText';
import { sendProfileData, getUserToken } from 'src/utils/authhelper';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Icon } from 'native-base';
import { GlobalHeader } from 'src/components/Header/Header';
import { getProfile } from 'src/redux/actions/actionsUserData';
import { ColorsList } from 'src/styles/colors';
import { Button } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import ImagePicker from 'react-native-image-crop-picker';
import { getStoreCategoryAPI } from 'src/utils/api/global_api';
import { typingWaitCallback } from 'src/utils/state';
import { SizeList } from 'src/styles/size';

const UpdateProfil = ({ navigation }) => {
	const dispatch = useDispatch()

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)
	const [searchKategori, setSearchKategori] = useState('')
	const [modalVisible, setModalVisible] = useState(false)
	const [name_store, setName_Store] = useState('')
	const [isTypingDesa, setIsTypingDesa] = useState(false)
	const [email_store, setEmail_Store] = useState('')
	const [photo_store, setPhotoStore] = useState('')
	const [address_store, setAddress_Store] = useState('')
	const [dataDesa, setDataDesa] = useState([])
	const [desaSelected, setDesaSelected] = useState({})
	const [dataKategori, setDataKategori] = useState([])
	const [kategoriSelected, setKategoriSelected] = useState({})
	const _searchDesa = pencarian => {
		setIsTypingDesa(true)
		typingWaitCallback(async () => {
			const { data: { status, data } } = await Wilayah.SearchAddress(pencarian)
			setIsTypingDesa(false)
			if (status == 200) {
				setDataDesa(data)
			}
		})
	}
	const _renderViewAlamat = item => {
		if (item.id) {
			return `${item.desa}, ${item.kecamatan}, ${item.kabupaten}, ${item.provinsi}`.toUpperCase()
		} else {
			return ''
		}
	}

	useEffect(() => {
		_getCategory()
	}, [])

	const _getCategory = async () => {
		const res = await getStoreCategoryAPI()
		if (res.status == 200) {
			setDataKategori(res.data)
		}
	}

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
	const [rbRef, setRbRef] = useState({})
	const _handleChoosePhoto = () => {
		ImagePicker.openCamera({
			compressImageQuality: .7
		}).then(
			(image) => setPhotoStore(image.path))
	}
	const [loading, setLoading] = useState(false)
	const _handleSaveProfile = async () => {
		if ([address_store, name_store, email_store, desaSelected.desa].includes('')) {
			setAlertMessage("Harap isi data toko dengan lengkap")
			setAlert(true)
		} else {
			setLoading(true)
			const id_user = await AsyncStorage.getItem('userId')
			const formData = new FormData()

			let final_address = `${address_store}, ${_renderViewAlamat(desaSelected)}`

			formData.append("id_user", id_user)
			formData.append("name_store", name_store)
			formData.append("email", email_store)
			formData.append("address_store", final_address)
			formData.append("category_store", kategoriSelected.id)
			formData.append('photo_store', photo_store != "" ? {
				uri: photo_store,
				type: "image/jpeg",
				name: `${Date.now()}.jpeg`
			} : null)
			const res = await sendProfileData(formData)
			if (res.status == 400) {
				setLoading(false)
				setAlertMessage(res.data.errors.msg)
				setAlert(true)
			} else {
				const userToken = await getUserToken()
				setLoading(false)
				setModalVisible(true)
				setTimeout(() => {
					setModalVisible(false)
					dispatch(getProfile(id_user, userToken))
					navigation.navigate('/')
				}, 1000)
			}
		}
	}

	return <Container>
		<AwanPopup.Alert
			message={alertMessage}
			visible={alert}
			closeAlert={() => setAlert(false)}
		/>
		<GlobalHeader title="Update Profil" onPressBack={() => navigation.goBack()} />
		<Body>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<ModalContent
					image={require('src/assets/images/successcreatestore.png')}
					infoText="Pembaruan Profil Berhasil!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<AwanPopup.Loading visible={loading} />
			{
				inputan.rMap((input, i) => <View style={{ marginBottom: SizeList.base }}><Input key={i} onChangeText={input.handleChangeText} value={input.value} label={input.label} /></View>)
			}
			<SelectBoxModal
				label="Kelurahan / Desa" closeOnSelect
				data={dataDesa}
				btnStyle={{ marginBottom: SizeList.base }}
				header={
					<MDInput label="Cari Desa"
						onChangeText={_searchDesa}
						renderLeftAccessory={() =>
							<Icon style={{ color: ColorsList.primary }} name="search" />}
					/>
				}
				hideRender={isTypingDesa}
				hideRenderItem={<ActivityIndicator color={ColorsList.primary} />}
				value={desaSelected.desa}
				handleChangePicker={item => setDesaSelected(item)}
				renderItem={item => (<Text font="SemiBold">{_renderViewAlamat(item)}</Text>)}>
				<Text>Data tidak ditemukan</Text>
			</SelectBoxModal>
			{desaSelected.id && <View style={styles.locationDetail}><Text>Alamat Lengkap: {_renderViewAlamat(desaSelected)}</Text></View>}
			<SelectBoxModal
				label="Kategori Toko" closeOnSelect
				btnStyle={{ marginBottom: SizeList.secondary }}
				data={dataKategori.filter(item => item.category.toLowerCase().includes(searchKategori.toLowerCase()))}
				header={
					<MDInput label="Cari Kategori"
						onChangeText={(text) => setSearchKategori(text)}
						renderLeftAccessory={() =>
							<Icon style={{ color: ColorsList.primary }} name="search" />}
					/>
				}
				value={kategoriSelected.category}
				handleChangePicker={item => setKategoriSelected(item)}
				renderItem={item => (<Text font="SemiBold">{item.category.toUpperCase()}</Text>)}>
				<Text>Data tidak ditemukan</Text>
			</SelectBoxModal>
			<View>
				<Text style={{ marginBottom: 10, color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
				<View style={styles.imageWrapper}>
					<TouchableOpacity onPress={_handleChoosePhoto} style={{ backgroundColor: 'white' }}>
						<Image style={styles.image} source={photo_store ? { uri: photo_store } : require('src/assets/images/img-product.png')} />
					</TouchableOpacity>
				</View>
			</View>
			{/* <PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} /> */}
		</Body>
		<Footer>
			<Button style={{ width: '100%' }} onPress={_handleSaveProfile}>SIMPAN</Button>
		</Footer>
	</Container >
}

export default UpdateProfil

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: ColorsList.greyAuthHard, borderWidth: 1, height: 250, borderRadius: SizeList.borderRadius },
	image: { width: '100%', height: '100%' },
	locationDetail: {
		marginHorizontal: 3,
		marginBottom: SizeList.base,
		padding: 5,
		backgroundColor: ColorsList.white,
		borderBottomLeftRadius: SizeList.borderRadius,
		borderBottomRightRadius: SizeList.borderRadius,
		borderWidth: SizeList.borderWidth,
		borderColor: ColorsList.borderColor
	}
})