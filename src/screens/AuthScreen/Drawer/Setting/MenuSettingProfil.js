import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, Modal } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { Text } from '../../../../components/Text/CustomText';
import { editStoreProfile } from '../../../../utils/authhelper';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { getProfile } from '../../../../redux/actions/actionsUserData';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { Icon } from 'native-base';
import Wilayah from 'src/utils/wilayah';
import Divider from 'src/components/Row/Divider';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const MenuSettingProfil = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const temp_profilepic = User.store.photo_store
	const [modalVisible, setModalVisible] = useState(false)
	const [apiLoading, setApiLoading] = useState(false)
	const [formValue, setFormValue] = useState({
		name: User.data.name,
		email_store: User.store.email_store,
		no_telp: User.data.phone_number,
		name_store: User.store.name_store,
		photo_store: User.store.photo_store,
		address_store: User.store.address_store ? User.store.address_store.split('%')[0] : null,
		id_user: User.data.id
	})

	const [provinsi, setProvinsi] = useState({
		selected: User.store.address_store ? { nama: User.store.address_store.split('%')[4] } : {},
		search: '',
		data: []
	})
	const [kabupaten, setKabupaten] = useState({
		selected: User.store.address_store ? { nama: User.store.address_store.split('%')[3] } : {},
		search: '',
		data: []
	})
	const [kecamatan, setKecamatan] = useState({
		selected: User.store.address_store ? { nama: User.store.address_store.split('%')[2] } : {},
		search: '',
		data: []
	})
	const [desa, setDesa] = useState({
		selected: User.store.address_store ? { nama: User.store.address_store.split('%')[1] } : {},
		search: '',
		data: []
	})

	const inputan = [{
		_label: "Nama",
		value: formValue.name,
		onChangeText: (text) => { setFormValue({ ...formValue, name: text }) }
	}, {
		_label: "Email",
		editable: false,
		value: formValue.email_store,
		keyboardType: 'email-address',
		onChangeText: (text) => { setFormValue({ ...formValue, email_store: text }) }
	}, {
		_label: "No. telepon",
		editable: false,
		value: formValue.no_telp,
		keyboardType: 'numeric',
		onChangeText: (text) => { setFormValue({ ...formValue, no_telp: text }) }
	},
	{
		_label: "Nama toko / kios",
		editable: true,
		value: formValue.name_store,
		onChangeText: (text) => { setFormValue({ ...formValue, name_store: text }) }
	}, {
		_label: "Alamat toko / kios",
		editable: true,
		value: formValue.address_store,
		onChangeText: (text) => { setFormValue({ ...formValue, address_store: text }) }
	}]
	const [rbRef, setRbRef] = useState({})
	const _handleChoosePhoto = image => {
		setFormValue({ ...formValue, photo_store: image.path })
	};

	const _handleSaveProfile = async () => {
		setApiLoading(true)
		const formData = new FormData()
		let final_address = `${formValue.address_store}%${desa.selected.nama}%${kecamatan.selected.nama}%${kabupaten.selected.nama}%${provinsi.selected.nama}`
		formData.appendObject(formValue, ['photo_store', 'address_store']) // ('Form data yang di append', 'kecuali')
		formData.append("address_store", final_address)
		formData.append('photo_store', formValue.photo_store != "" ? formValue.photo_store != temp_profilepic ? {
			uri: formValue.photo_store,
			type: "image/jpeg",
			name: `${Date.now()}.jpeg`
		} : null : null)
		const res = await editStoreProfile(formData, User.store.id_store)
		setApiLoading(false)
		if (res.status == 400) {
			alert(data.errors.msg)
		} else if (res.status == 200) {
			setModalVisible(true)
			setTimeout(() => {
				setModalVisible(false)
				dispatch(getProfile(User.data.id))
				navigation.navigate('/drawer/settings')
			}, 1000)
		}
		else {
			alert(JSON.stringify(res))
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
	return <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
		<AwanPopup.Loading visible={apiLoading} />
		<GlobalHeader title="Update Profil" onPressBack={() => navigation.goBack()} />
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(!modalVisible);
			}}
		>
			<ModalContent
				image={require('../../../../assets/images/successupdateprofile.png')}
				infoText="Pembaruan Profil Berhasil!"
				closeModal={() => setModalVisible(false)}
			/>
		</Modal>
		<ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
			<View style={{ paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
				{
					inputan.map((input, i) => {
						return <FloatingInput key={i} style={styles.floatingInput} label={input._label}>
							<TextInput style={{ width: '90%' }} {...input} />
						</FloatingInput>
					})
				}

				<SelectBoxModal
					label="Provinsi" closeOnSelect data={provinsi.data.filter(item => item.nama.toLowerCase().includes(provinsi.search)).sort((a, b) => a.nama.localeCompare(b.nama))}
					header={
						<View>
							<FloatingInput left="10%" label="Cari Provinsi">
								<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
								<TextInput _width='90%' value={provinsi.search} onChangeText={text => setProvinsi({ ...provinsi, search: text })} />
							</FloatingInput>
						</View>
					}
					value={provinsi.selected ? provinsi.selected.nama : null}
					handleChangePicker={_setProvinsi}
					renderItem={(item) => (<Text>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal
					label="Kabupaten / Kota" closeOnSelect data={kabupaten.data.filter(item => item.nama.toLowerCase().includes(kabupaten.search)).sort((a, b) => a.nama.localeCompare(b.nama))}
					header={
						<View>
							<FloatingInput left="10%" label="Cari Kabupaten">
								<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
								<TextInput _width='90%' value={kabupaten.search} onChangeText={text => setKabupaten({ ...kabupaten, search: text })} />
							</FloatingInput>
						</View>
					}
					value={kabupaten.selected ? kabupaten.selected.nama : null}
					handleChangePicker={_setKabupaten}
					renderItem={(item) => (<Text>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal
					label="Kecamatan" closeOnSelect data={kecamatan.data.filter(item => item.nama.toLowerCase().includes(kecamatan.search)).sort((a, b) => a.nama.localeCompare(b.nama))}
					header={
						<View>
							<FloatingInput left="10%" label="Cari Kecamatan">
								<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
								<TextInput _width='90%' value={kecamatan.search} onChangeText={text => setKecamatan({ ...kecamatan, search: text })} />
							</FloatingInput>
						</View>
					}
					value={kecamatan.selected ? kecamatan.selected.nama : null}
					handleChangePicker={_setKecamatan}
					renderItem={(item) => (<Text>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal
					label="Kelurahan / Desa" closeOnSelect data={desa.data.filter(item => item.nama.toLowerCase().includes(desa.search)).sort((a, b) => a.nama.localeCompare(b.nama))}
					header={
						<View>
							<FloatingInput left="10%" label="Cari Desa">
								<Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
								<TextInput _width='90%' value={desa.search} onChangeText={text => setDesa({ ...desa, search: text })} />
							</FloatingInput>
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
						<Image style={styles.image} source={formValue.photo_store ? { uri: formValue.photo_store } : require('../../../../assets/images/img-product.png')} />
					</TouchableOpacity>
				</View>
			</View>

		</ScrollView>
		<PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} />
		<Bottom>
			<Button width="100%" onPress={_handleSaveProfile}>SIMPAN</Button>
		</Bottom>
	</View>

}

export default MenuSettingProfil

const styles = StyleSheet.create({
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})