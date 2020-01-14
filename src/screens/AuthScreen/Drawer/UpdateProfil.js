import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { View, StyleSheet, Image, TextInput, Modal } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import { FloatingInput } from 'src/components/Input/InputComp';
import AsyncStorage from '@react-native-community/async-storage';
import { sendProfileData } from 'src/utils/authhelper';
import { getProfile } from 'src/redux/actions/actionsUserData';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import Wilayah from 'src/utils/wilayah';
import { Icon } from 'native-base';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Divider from 'src/components/Row/Divider';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';


const UpdateProfil = ({ navigation }) => {
	const dispatch = useDispatch()

	const [modalVisible, setModalVisible] = useState(false)
	const [name_store, setName_Store] = useState('')
	const [email_store, setEmail_Store] = useState('')
	const [photo_store, setPhotoStore] = useState('')
	const [address_store, setAddress_Store] = useState()
	const [provinsi, setProvinsi] = useState({
		selected: '',
		search: '',
		data: []
	})
	const [kabupaten, setKabupaten] = useState({
		selected: '',
		search: '',
		data: []
	})
	const [kecamatan, setKecamatan] = useState({
		selected: '',
		search: '',
		data: []
	})
	const [desa, setDesa] = useState({
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
		if (desa.selected == "" || kecamatan.selected == "" || kabupaten.selected == "" || provinsi.selected == "") {
			alert("Harap pilih daerah toko")
		} else {
			console.debug(email_store)
			setLoading(true)
			const id_user = await AsyncStorage.getItem('userId')
			const formData = new FormData()
			let final_address = `${address_store}%${desa.selected.nama}%${kecamatan.selected.nama}%${kabupaten.selected.nama}%${provinsi.selected.nama}`
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
		setProvinsi({ ...provinsi, selected: item })
		Wilayah.Kabupaten(item.id).then((res) => {
			setKabupaten({ ...kabupaten, data: res.data.kabupatens })
		})
	}

	const _setKabupaten = (item) => {
		setKabupaten({ ...kabupaten, selected: item })
		Wilayah.Kecamatan(item.id).then((res) => {
			setKecamatan({ ...kecamatan, data: res.data.kecamatans })
		})
	}

	const _setKecamatan = (item) => {
		setKecamatan({ ...kecamatan, selected: item })
		Wilayah.Desa(item.id).then((res) => {
			setDesa({ ...desa, data: res.data.desas })
		})
	}

	const _setDesa = (item) => {
		setDesa({ ...desa, selected: item })
	}

	useEffect(() => {
		Wilayah.Provinsi().then((res) => {
			setProvinsi({ ...provinsi, data: res.data.semuaprovinsi })
		})
	}, [])

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
					image={require('src/assets/images/successcreatestore.png')}
					infoText="Pembaruan Profil Berhasil!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<AwanPopup.Loading visible={loading} />
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

					<SelectBoxModal style={{ marginTop: 15 }}
						label="Provinsi" closeOnSelect data={provinsi.data.filter(item => item.nama.toLowerCase().includes(provinsi.search.toLowerCase())).sort((a, b) => a.nama.localeCompare(b.nama))}
						header={
							<View>
								<FloatingInput left="10%" label="Cari Provinsi">
									<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
									<TextInput _width='90%' value={provinsi.search} onChangeText={text => setProvinsi({ ...provinsi, search: text })} />
									{/* <Wrapper justify="center"></Wrapper> */}
								</FloatingInput>
								<Divider />
							</View>
						}
						value={provinsi.selected ? provinsi.selected.nama : null}
						handleChangePicker={_setProvinsi}
						renderItem={(item) => (<Text>{item.nama}</Text>)}>
						<Text>Data tidak ditemukan</Text>
					</SelectBoxModal>

					<SelectBoxModal style={{ marginTop: 15 }}
						label="Kabupaten / Kota" closeOnSelect data={kabupaten.data.filter(item => item.nama.toLowerCase().includes(kabupaten.search.toLowerCase())).sort((a, b) => a.nama.localeCompare(b.nama))}
						header={
							<View>
								<FloatingInput left="10%" label="Cari Kabupaten">
									<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
									<TextInput _width='90%' value={kabupaten.search} onChangeText={text => setKabupaten({ ...kabupaten, search: text })} />
									{/* <Wrapper justify="center"></Wrapper> */}
								</FloatingInput>
								<Divider />
							</View>
						}
						value={kabupaten.selected ? kabupaten.selected.nama : null}
						handleChangePicker={_setKabupaten}
						renderItem={(item) => (<Text>{item.nama}</Text>)}>
						<Text>Data tidak ditemukan</Text>
					</SelectBoxModal>

					<SelectBoxModal style={{ marginTop: 15 }}
						label="Kecamatan" closeOnSelect data={kecamatan.data.filter(item => item.nama.toLowerCase().includes(kecamatan.search.toLowerCase())).sort((a, b) => a.nama.localeCompare(b.nama))}
						header={
							<View>
								<FloatingInput left="10%" label="Cari Kecamatan">
									<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
									<TextInput _width='90%' value={kecamatan.search} onChangeText={text => setKecamatan({ ...kecamatan, search: text })} />
									{/* <Wrapper justify="center"></Wrapper> */}
								</FloatingInput>
								<Divider />
							</View>
						}
						value={kecamatan.selected ? kecamatan.selected.nama : null}
						handleChangePicker={_setKecamatan}
						renderItem={(item) => (<Text>{item.nama}</Text>)}>
						<Text>Data tidak ditemukan</Text>
					</SelectBoxModal>

					<SelectBoxModal style={{ marginTop: 15 }}
						label="Kelurahan / Desa" closeOnSelect data={desa.data.filter(item => item.nama.toLowerCase().includes(desa.search.toLowerCase())).sort((a, b) => a.nama.localeCompare(b.nama))}
						header={
							<View>
								<FloatingInput left="10%" label="Cari Desa">
									<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
									<TextInput _width='90%' value={desa.search} onChangeText={text => setDesa({ ...desa, search: text })} />
									{/* <Wrapper justify="center"></Wrapper> */}
								</FloatingInput>
								<Divider />
							</View>
						}
						value={desa.selected ? desa.selected.nama : null}
						handleChangePicker={_setDesa}
						renderItem={(item) => (<Text>{item.nama}</Text>)}>
						<Text>Data tidak ditemukan</Text>
					</SelectBoxModal>
				</View>
				<View style={{ marginBottom: 70 }}>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity onPress={() => rbRef.open()} style={{ backgroundColor: 'white' }}>
							<Image style={styles.image} source={photo_store ? { uri: photo_store } : require('src/assets/images/img-product.png')} />
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
			<PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} />
			<Bottom>
				<Button style={{ width: '100%' }} onPress={_handleSaveProfile}>SIMPAN</Button>
			</Bottom>
		</View >
	)
}

export default UpdateProfil

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})