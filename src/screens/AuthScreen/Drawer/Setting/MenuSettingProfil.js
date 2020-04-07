import Wilayah from 'src/utils/wilayah';
import React, { useState, useEffect } from 'react';
import ModalContent from 'src/components/ModalContent/ModalContent';
import MDInput from 'src/components/Input/MDInput';
import Container, { Body, Footer } from 'src/components/View/Container';
import { View, Image, StyleSheet, Modal, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'src/components/Text/CustomText';
import { stateObject } from 'src/utils/state';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Icon } from 'native-base';
import { GlobalHeader } from 'src/components/Header/Header';
import { getProfile } from 'src/redux/actions/actionsUserData';
import { editStoreProfile } from 'src/utils/authhelper';
import { ColorsList } from 'src/styles/colors';
import { Button } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const MenuSettingProfil = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const temp_profilepic = User.store.photo_store
	const [dataDesa, setDataDesa] = useState([])
	const [desaSelected, setDesaSelected] = useState({})
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
	const [modalVisible, setModalVisible] = useState(false)
	const [apiLoading, setApiLoading] = useState(false)

	const [form, setForm] = stateObject({
		name: User.data.name,
		email_store: User.store.email_store,
		no_telp: User.data.phone_number,
		name_store: User.store.name_store,
		photo_store: User.store.photo_store,
		address_store: User.store.address_store ? User.store.address_store.split('%')[0] : null,
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
	const _handleChoosePhoto = ({ path: photo_store }) => {
		setForm({ photo_store })
	};

	const _handleSaveProfile = async () => {
		setApiLoading(true)
		const formData = new FormData()
		let final_address = `${form.address_store}, ${_renderViewAlamat(desaSelected)}`

		formData.appendObject(form, ['photo_store', 'address_store']) // ('Form data yang di append', 'kecuali')
		formData.append("address_store", final_address)
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
			setModalVisible(true)
			setTimeout(() => {
				setModalVisible(false)
				dispatch(getProfile(User.data.id))
				navigation.navigate('/drawer/settings')
			}, 1000)
		} else {
			alert(JSON.stringify(res))
		}
	}
	useEffect(() => {
		if (User.store && User.store.address_store) {
			let [alamat, desa, kecamatan, kabupaten, provinsi] = User.store.address_store.split(', ')
			if (provinsi) {
				setDesaSelected({ id: Math.randomInt(0, 9999), desa, kecamatan, kabupaten, provinsi })
			}
		}
	}, [])
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
			<View style={{ paddingHorizontal: 15, marginBottom: 15, paddingBottom: 15, backgroundColor: 'white' }}>
				<FlatList
					data={inputan}
					keyExtractor={(a, i) => i.toString()}
					renderItem={({ item: input }) => <MDInput style={styles.floatingInput} label={input._label} style={{ width: '90%' }} {...input} />}
				/>
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
			</View>
			<View>
				<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
				<View style={styles.imageWrapper}>
					<TouchableOpacity onPress={() => rbRef.open()} style={{ backgroundColor: 'white' }}>
						<Image style={styles.image} source={form.photo_store ? { uri: form.photo_store } : require('src/assets/images/img-product.png')} />
					</TouchableOpacity>
				</View>
			</View>
			<PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} />
		</Body>
		<Footer>
			<Button onPress={_handleSaveProfile}>SIMPAN</Button>
		</Footer>
	</Container>
}

export default MenuSettingProfil

const styles = StyleSheet.create({
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})