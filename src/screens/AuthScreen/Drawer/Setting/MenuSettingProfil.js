import Wilayah from 'src/utils/wilayah';
import React, { useState, useEffect } from 'react';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { Input } from 'src/components/Input/MDInput';
import Container, { Body, Footer } from 'src/components/View/Container';
import { View, Image, StyleSheet, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'src/components/Text/CustomText';
import { stateObject, typingWaitCallback } from 'src/utils/state';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { Icon } from 'native-base';
import { GlobalHeader } from 'src/components/Header/Header';
import { getProfile } from 'src/redux/actions/actionsUserData';
import { editStoreProfile, getUserToken } from 'src/utils/authhelper';
import { ColorsList } from 'src/styles/colors';
import { Button } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getStoreCategoryAPI } from 'src/utils/api/global_api';
import ImagePicker from 'react-native-image-crop-picker';
import { SizeList } from 'src/styles/size';

const MenuSettingProfil = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const temp_profilepic = User.store.photo_store
	const [searchKategori, setSearchKategori] = useState('')
	const [dataDesa, setDataDesa] = useState([])
	const [desaSelected, setDesaSelected] = useState({})
	const [dataKategori, setDataKategori] = useState([])
	const [isTypingDesa, setIsTypingDesa] = useState(false)
	const [kategoriSelected, setKategoriSelected] = useState(User.store.category_store)
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
			return `${item.desa}, ${item.kecamatan}, ${item.kabupaten}, ${item.provinsi}`
		} else {
			return ''
		}
	}
	const [modalVisible, setModalVisible] = useState(false)
	const [apiLoading, setApiLoading] = useState(false)

	const [form, setForm] = stateObject({
		name: User.data.name,
		email_store: User.store.email_store,
		no_telp: User.data.phone_number,
		name_store: User.store.name_store,
		photo_store: User.store.photo_store,
		address_store: User.store.address_store ? User.store.address_store.split(', ')[0] : null,
		id_user: User.data.id
	})

	const inputan = [{
		_label: "Nama",
		value: form.name,
		onChangeText: name => { setForm({ name }) }
	}, {
		_label: "Email",
		editable: false,
		value: form.email_store,
		keyboardType: 'email-address',
		onChangeText: email_store => { setForm({ email_store }) }
	}, {
		_label: "No. telepon",
		editable: false,
		value: form.no_telp,
		keyboardType: 'numeric',
		onChangeText: no_telp => { setForm({ no_telp }) }
	},
	{
		_label: "Nama toko / kios",
		editable: true,
		value: form.name_store,
		onChangeText: name_store => { setForm({ name_store }) }
	}, {
		_label: "Alamat toko / kios",
		editable: true,
		value: form.address_store,
		onChangeText: address_store => { setForm({ address_store }) }
	}]
	const [rbRef, setRbRef] = useState({})
	const _handleChoosePhoto = () => {
		ImagePicker.openCamera({
			compressImageQuality: .7
		}).then(
			({ path: photo_store }) => setForm({ photo_store }))
	}

	const _handleSaveProfile = async () => {
		setApiLoading(true)
		const formData = new FormData()
		let final_address = `${form.address_store}, ${_renderViewAlamat(desaSelected)}`

		formData.appendObject(form, ['photo_store', 'address_store']) // ('Form data yang di append', 'kecuali')
		formData.append("address_store", final_address)
		formData.append("category_store", kategoriSelected.id)
		formData.append('photo_store', form.photo_store != "" ? form.photo_store != temp_profilepic ? {
			uri: form.photo_store,
			type: "image/jpeg",
			name: `${Date.now()}.jpeg`
		} : null : null)
		const res = await editStoreProfile(formData, User.store.id_store)
		setApiLoading(false)
		if (res.status == 400) {
			alert(data.errors.msg)
		} else if (res.status == 200) {
			const userToken = await getUserToken()
			setModalVisible(true)
			setTimeout(() => {
				setModalVisible(false)
				dispatch(getProfile(User.data.id, userToken))
				navigation.navigate('/drawer/settings')
			}, 1000)
		} else {
			alert(JSON.stringify(res))
		}
	}
	useEffect(() => {
		if (User.store && User.store.address_store) {
			let [address_store, desa, kecamatan, kabupaten, provinsi] = User.store.address_store.split(', ')
			if (provinsi) {
				setDesaSelected({ id: Math.randomInt(0, 9999), desa, kecamatan, kabupaten, provinsi })
			}
		}
		_getCategory()
	}, [])

	const _getCategory = async () => {
		const res = await getStoreCategoryAPI()
		if (res.status == 200) {
			setDataKategori(res.data)
		}
	}
	return <Container>
		<GlobalHeader title="Update Profil" onPressBack={() => navigation.goBack()} />
		<Body>
			<AwanPopup.Loading visible={apiLoading} />
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<ModalContent
					image={require('src/assets/images/successupdateprofile.png')}
					infoText="Pembaruan Profil Berhasil!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<FlatList
				data={inputan}
				keyExtractor={(a, i) => i.toString()}
				renderItem={({ item: input }) => <View style={{ marginBottom: 5 }}><Input label={input._label}  {...input} /></View>}
			/>
			<SelectBoxModal
				label="Kelurahan / Desa" closeOnSelect
				data={dataDesa}
				header={
					<Input label="Cari Desa"
						onChangeText={_searchDesa}
						renderLeftAccessory={() =>
							<Icon style={{ color: ColorsList.primary }} name="search" />}
					/>
				}
				value={desaSelected.desa}
				handleChangePicker={item => setDesaSelected(item)}
				hideRender={isTypingDesa}
				hideRenderItem={<ActivityIndicator color={ColorsList.primary} />}
				renderItem={item => (<Text>{_renderViewAlamat(item)}</Text>)}>
				<Text>Data tidak ditemukan</Text>
			</SelectBoxModal>
			{desaSelected.id && <View style={styles.locationDetail}>
				<Text font="SemiBold">
					{_renderViewAlamat(desaSelected)}
				</Text>
			</View>}
			<SelectBoxModal style={{ marginTop: SizeList.base }}
				label="Kategori Toko" closeOnSelect
				data={dataKategori.filter(item => item.category.toLowerCase().includes(searchKategori.toLowerCase()))}
				header={
					<Input label="Cari Kategori"
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
			{/* </View> */}
			<View>
				<Text style={{ marginVertical: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
				<View style={styles.imageWrapper}>
					<TouchableOpacity onPress={_handleChoosePhoto} style={{ backgroundColor: 'white' }}>
						<Image style={styles.image} source={form.photo_store ? { uri: form.photo_store } : require('src/assets/images/img-product.png')} />
					</TouchableOpacity>
				</View>
			</View>
			{/* <PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} /> */}
		</Body>
		<Footer>
			<Button onPress={_handleSaveProfile}>SIMPAN</Button>
		</Footer>
	</Container>
}

export default MenuSettingProfil

const styles = StyleSheet.create({
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: ColorsList.greyAuthHard, borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
	locationDetail: {
		padding: 5,
		elevation: 1,
		backgroundColor: ColorsList.white,
		borderBottomLeftRadius: SizeList.borderRadius,
		borderBottomRightRadius: SizeList.borderRadius
	}
})