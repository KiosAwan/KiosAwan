import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Modal, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { } from 'src/components/Input/InputComp';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { editStoreProfile } from 'src/utils/authhelper';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getProfile } from 'src/redux/actions/actionsUserData';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { Icon } from 'native-base';
import Wilayah from 'src/utils/wilayah';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import MDInput from 'src/components/Input/MDInput';
import { stateObject } from 'src/utils/state';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Dot } from 'src/utils/dot-object';

const MenuSettingProfil = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const temp_profilepic = User.store.photo_store
	const daerahMap = ['desa', 'kecamatan', 'kabupaten', 'provinsi']
	const [modalVisible, setModalVisible] = useState(false)
	const [apiLoading, setApiLoading] = useState(false)
	const defaultDaerah = {
		selected: User.store.address_store ? { nama: User.store.address_store.split('%')[4] } : {},
		search: '',
		data: []
	}
	const [form, setForm] = stateObject({
		name: User.data.name,
		email_store: User.store.email_store,
		no_telp: User.data.phone_number,
		name_store: User.store.name_store,
		photo_store: User.store.photo_store,
		address_store: User.store.address_store ? User.store.address_store.split('%')[0] : null,
		id_user: User.data.id
	})

	const splitDaerah = daerah => {
		const address = User.store.address_store ? User.store.address_store.split('%') : []
		if (address.length > 0) {
			const [alamat, _desa, _kecamatan, _kabupaten, _provinsi] = address
			if (address.length > 2) {
				return { nama: eval(`_${daerah}`) }
			} else {
				const dataDaerah = JSON.parse(_desa)
				return Dot(daerah, dataDaerah)
			}
		}
	}

	const [provinsi, setProvinsi] = stateObject({
		...defaultDaerah,
		selected: splitDaerah('provinsi')
	})
	const [kabupaten, setKabupaten] = stateObject({
		...defaultDaerah,
		selected: splitDaerah('kabupaten')
	})
	const [kecamatan, setKecamatan] = stateObject({
		...defaultDaerah,
		selected: splitDaerah('kecamatan')
	})
	const [desa, setDesa] = stateObject({
		...defaultDaerah,
		selected: splitDaerah('desa')
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
		const daerah = daerahMap.map(_daerah => {
			return { name: _daerah, data: eval(`${_daerah}.selected`) }
		}).reduce((obj, item) => {
			obj[item.name] = item.data
			return obj
		}, {})
		setApiLoading(true)
		const formData = new FormData()
		let final_address = `${form.address_store}%${JSON.stringify(daerah)}`
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
		}
		else {
			alert(JSON.stringify(res))
		}
	}

	const _filterData = obj => {
		return obj && obj.data ? obj.data
			.filter(item => item.nama.toLowerCase()
				.includes(obj.search))
			.sort((a, b) => a.nama
				.localeCompare(b.nama)) : []
	}

	const _setProvinsi = async item => {
		setProvinsi({ selected: item }, () => { })
		if (item.id) {
			const { data } = await Wilayah.Kabupaten(item.id)
			setKabupaten({ data: data.kabupatens })
		}
		if (!provinsi.data.length > 0) {
			const { data: { semuaprovinsi: data } } = await Wilayah.Provinsi()
			setProvinsi({ data })
		}
		return true
	}

	const _setKabupaten = async item => {
		setKabupaten({ selected: item })
		if (item.id) {
			const { data } = await Wilayah.Kecamatan(item.id)
			setKecamatan({ data: data.kecamatans })
		}
		return true
	}

	const _setKecamatan = async item => {
		setKecamatan({ selected: item })
		if (item.id) {
			const { data } = await Wilayah.Desa(item.id)
			setDesa({ data: data.desas })
		}
		return true
	}

	const _setDesa = (item) => {
		setDesa({ selected: item })
	}

	const _getDataDaerah = async () => {
		if (kecamatan.selected) {
			await _setKecamatan(kecamatan.selected)
		}
		if (kabupaten.selected) {
			await _setKabupaten(kabupaten.selected)
		}
		if (provinsi.selected) {
			await _setProvinsi(provinsi.selected)
		}
	}

	useEffect(() => {
		_getDataDaerah()
		Wilayah.Provinsi().then(({ data: { semuaprovinsi: data } }) => {
			setProvinsi({ data })
		})
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
			<View style={{ paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
				<FlatList
					data={inputan}
					keyExtractor={(a, i) => i.toString()}
					renderItem={({ item: input }) => <MDInput style={styles.floatingInput} label={input._label} style={{ width: '90%' }} {...input} />}
				/>

				<SelectBoxModal
					label="Provinsi" closeOnSelect data={_filterData(provinsi)}
					header={
						<MDInput label="Cari Provinsi"
							renderLeftAccessory={() => <Icon style={{ color: ColorsList.primary }} name="search" />}
							value={provinsi.search} onChangeText={search => setProvinsi({ search })} />
					}
					value={provinsi.selected ? provinsi.selected.nama : null}
					handleChangePicker={_setProvinsi}
					renderItem={(item) => (<Text color={item.id == provinsi.selected.id ? 'primary' : 'greyFont'}>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal
					label="Kabupaten / Kota" closeOnSelect data={_filterData(kabupaten)}
					header={
						<MDInput label="Cari Kabupaten"
							renderLeftAccessory={() => <Icon style={{ color: ColorsList.primary }} name="search" />}
							value={kabupaten.search} onChangeText={search => setKabupaten({ search })} />
					}
					value={kabupaten.selected ? kabupaten.selected.nama : null}
					handleChangePicker={_setKabupaten}
					renderItem={(item) => (<Text color={item.id == kabupaten.selected.id ? 'primary' : 'greyFont'}>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal
					label="Kecamatan" closeOnSelect data={_filterData(kecamatan)}
					header={
						<MDInput label="Cari Kecamatan"
							renderLeftAccessory={() => <Icon style={{ color: ColorsList.primary }} name="search" />}
							value={kecamatan.search} onChangeText={search => setKecamatan({ search })} />
					}
					value={kecamatan.selected ? kecamatan.selected.nama : null}
					handleChangePicker={_setKecamatan}
					renderItem={(item) => (<Text color={item.id == kecamatan.selected.id ? 'primary' : 'greyFont'}>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>

				<SelectBoxModal
					label="Kelurahan / Desa" closeOnSelect data={_filterData(desa)}
					header={
						<MDInput label="Cari Desa"
							renderLeftAccessory={() => <Icon style={{ color: ColorsList.primary }} name="search" />}
							value={desa.search} onChangeText={search => setDesa({ search })} />
					}
					value={desa.selected ? desa.selected.nama : null}
					handleChangePicker={_setDesa}
					renderItem={(item) => (<Text color={item.id == desa.selected.id ? 'primary' : 'greyFont'}>{item.nama}</Text>)}>
					<Text>Data tidak ditemukan</Text>
				</SelectBoxModal>
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