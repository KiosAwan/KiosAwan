import Wilayah from 'src/utils/wilayah';
import React, { useState, useEffect } from 'react';
import ModalContent from 'src/components/ModalContent/ModalContent';
import MDInput from 'src/components/Input/MDInput';
import Container, { Footer, Body } from 'src/components/View/Container';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Image, Modal } from 'react-native';
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

const UpdateProfil = ({ navigation }) => {
	const dispatch = useDispatch()
	const [searchKategori, setSearchKategori] = useState('')
	const [modalVisible, setModalVisible] = useState(false)
	const [name_store, setName_Store] = useState('')
	const [email_store, setEmail_Store] = useState('')
	const [photo_store, setPhotoStore] = useState('')
	const [address_store, setAddress_Store] = useState('')
	const [dataDesa, setDataDesa] = useState([])
	const [desaSelected, setDesaSelected] = useState({})
	const [dataKategori, setDataKategori] = useState([])
	const [kategoriSelected, setKategoriSelected] = useState({})
	const _searchDesa = async pencarian => {
		const { data: { status, data } } = await Wilayah.SearchAddress(pencarian)
		if (status == 200) {
			setDataDesa(data)
		}
	}
	const _renderViewAlamat = item => {
		if (item.id) {
			return `${item.desa}, ${item.kecamatan}, ${item.kabupaten}, ${item.provinsi}`
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
			alert("Harap isi data toko dengan lengkap")
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
				alert(res.data.errors.msg)
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
			<View style={{ paddingVertical: 30, paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
				{
					inputan.map((input, i) => <MDInput key={i} onChangeText={input.handleChangeText} value={input.value} label={input.label} />)
				}
				<SelectBoxModal style={{ marginTop: 15 }}
					label="Kelurahan / Desa" closeOnSelect
					data={dataDesa}
					header={
						<MDInput label="Cari Desa"
							onChangeText={_searchDesa}
							renderLeftAccessory={() =>
								<Icon style={{ color: ColorsList.primary }} name="search" />}
						/>
					}
					value={desaSelected.desa}
					handleChangePicker={item => setDesaSelected(item)}
					renderItem={item => (<Text>{_renderViewAlamat(item)}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>
				{desaSelected.id && <Text style={{ marginTop: 10 }}>Alamat Lengkap: {_renderViewAlamat(desaSelected)}</Text>}
				<SelectBoxModal style={{ marginTop: 15 }}
					label="Kategori Toko" closeOnSelect
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
					renderItem={item => (<Text>{item.category}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>
			</View>
			<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
			<View style={styles.imageWrapper}>
				<TouchableOpacity onPress={_handleChoosePhoto} style={{ backgroundColor: 'white' }}>
					<Image style={styles.image} source={photo_store ? { uri: photo_store } : require('src/assets/images/img-product.png')} />
				</TouchableOpacity>
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
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})