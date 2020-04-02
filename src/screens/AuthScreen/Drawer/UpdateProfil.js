import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { View, StyleSheet, Image, Modal } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import { } from 'src/components/Input/InputComp';
import AsyncStorage from '@react-native-community/async-storage';
import { sendProfileData } from 'src/utils/authhelper';
import { getProfile } from 'src/redux/actions/actionsUserData';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import Wilayah from 'src/utils/wilayah';
import { Icon } from 'native-base';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Button } from 'src/components/Button/Button';
import MDInput from 'src/components/Input/MDInput';
import { stateObject } from 'src/utils/state';
import Container, { Footer, Body } from 'src/components/View/Container';


const UpdateProfil = ({ navigation }) => {
	const dispatch = useDispatch()

	const [modalVisible, setModalVisible] = useState(false)
	const [name_store, setName_Store] = useState('')
	const [email_store, setEmail_Store] = useState('')
	const [photo_store, setPhotoStore] = useState('')
	const [address_store, setAddress_Store] = useState('')
	const [provinsi, setProvinsi] = stateObject({
		selected: '',
		search: '',
		data: []
	})
	const [kabupaten, setKabupaten] = stateObject({
		selected: '',
		search: '',
		data: []
	})
	const [kecamatan, setKecamatan] = stateObject({
		selected: '',
		search: '',
		data: []
	})
	const [desa, setDesa] = stateObject({
		selected: '',
		search: '',
		data: []
	})
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
	const _handleChoosePhoto = image => {
		setPhotoStore(image.path)
	}
	const [loading, setLoading] = useState(false)
	const _handleSaveProfile = async () => {
		if ([address_store, name_store, email_store, desa.selected, kecamatan.selected, kabupaten.selected, provinsi.selected].includes('')) {
			alert("Harap isi data toko dengan lengkap")
		} else {
			setLoading(true)
			const daerahMap = ['desa', 'kecamatan', 'kabupaten', 'provinsi']
			const id_user = await AsyncStorage.getItem('userId')
			const formData = new FormData()
			const daerah = daerahMap.map(_daerah => {
				return { name: _daerah, data: eval(`${_daerah}.selected`) }
			}).reduce((obj, item) => {
				obj[item.name] = item.data
				return obj
			}, {})
			
			let final_address = `${address_store}%${JSON.stringify(daerah)}`

			formData.append("id_user", id_user)
			formData.append("name_store", name_store)
			formData.append("email", email_store)
			formData.append("address_store", final_address)
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
				setLoading(false)
				setModalVisible(true)
				setTimeout(() => {
					setModalVisible(false)
					dispatch(getProfile(id_user))
					navigation.navigate('/')
				}, 1000)
			}
		}
	}

	const _setProvinsi = (item) => {
		setProvinsi({ selected: item })
		Wilayah.Kabupaten(item.id).then((res) => {
			setKabupaten({ data: res.data.kabupatens })
		})
	}

	const _setKabupaten = (item) => {
		setKabupaten({ selected: item })
		Wilayah.Kecamatan(item.id).then((res) => {
			setKecamatan({ data: res.data.kecamatans })
		})
	}

	const _setKecamatan = (item) => {
		setKecamatan({ selected: item })
		Wilayah.Desa(item.id).then((res) => {
			setDesa({ data: res.data.desas })
		})
	}

	const _setDesa = (item) => {
		setDesa({ selected: item })
	}

	const _dataFiltered = (data, search) => {
		const result = data.filter(item => {
			return item.nama.toLowerCase()
				.includes(search.toLowerCase())
		})
			.sort((a, b) => a.nama.localeCompare(b.nama))
		return result
	}

	useEffect(() => {
		Wilayah.Provinsi().then((res) => {
			setProvinsi({ data: res.data.semuaprovinsi })
		})
	}, [])

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
					label="Provinsi" closeOnSelect
					data={_dataFiltered(provinsi.data, provinsi.search)}
					header={
						<MDInput label="Cari Provinsi" renderLeftAccessory={() =>
							<Icon style={{ color: ColorsList.primary }} name="search" />}
							value={provinsi.search} onChangeText={text => setProvinsi({ search: text })} />
					}
					value={provinsi.selected ? provinsi.selected.nama : null}
					handleChangePicker={_setProvinsi}
					renderItem={(item) => (<Text>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal style={{ marginTop: 15 }}
					label="Kabupaten / Kota" closeOnSelect
					data={_dataFiltered(kabupaten.data, kabupaten.search)}
					header={
						<MDInput label="Cari Kabupaten" renderLeftAccessory={() =>
							<Icon style={{ color: ColorsList.primary }} name="search" />}
							value={kabupaten.search} onChangeText={text => setKabupaten({ search: text })} />
					}
					value={kabupaten.selected ? kabupaten.selected.nama : null}
					handleChangePicker={_setKabupaten}
					renderItem={(item) => (<Text>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal style={{ marginTop: 15 }}
					label="Kecamatan" closeOnSelect
					data={_dataFiltered(kecamatan.data, kecamatan.search)}
					header={
						<MDInput label="Cari Kecamatan" renderLeftAccessory={() =>
							<Icon style={{ color: ColorsList.primary }} name="search" />}
							value={kecamatan.search} onChangeText={text => setKecamatan({ search: text })} />
					}
					value={kecamatan.selected ? kecamatan.selected.nama : null}
					handleChangePicker={_setKecamatan}
					renderItem={(item) => (<Text>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal style={{ marginTop: 15 }}
					label="Kelurahan / Desa" closeOnSelect
					data={_dataFiltered(desa.data, desa.search)}
					header={
						<MDInput label="Cari Desa" renderLeftAccessory={() =>
							<Icon style={{ color: ColorsList.primary }} name="search" />}
							value={desa.search} onChangeText={text => setDesa({ search: text })} />
					}
					value={desa.selected ? desa.selected.nama : null}
					handleChangePicker={_setDesa}
					renderItem={(item) => (<Text>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>
			</View>
			<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
			<View style={styles.imageWrapper}>
				<TouchableOpacity onPress={() => rbRef.open()} style={{ backgroundColor: 'white' }}>
					<Image style={styles.image} source={photo_store ? { uri: photo_store } : require('src/assets/images/img-product.png')} />
				</TouchableOpacity>
			</View>
			<PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} />
		</Body>
		<Footer>
			<Button style={{ width: '100%' }} onPress={_handleSaveProfile}>SIMPAN</Button>
		</Footer>
	</Container>
}

export default UpdateProfil

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})