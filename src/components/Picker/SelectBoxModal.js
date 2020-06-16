import { Item, Input, Icon, Card, CardItem, Body, Grid, Col } from 'native-base';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { FloatingInputLabel } from '../Input/InputComp';
import { ColorsList } from '../../styles/colors';
import { convertRupiah, sendNewCustomer, editCustomer, deleteCustomer, getUserToken } from '../../utils/authhelper';
import { useDispatch, useSelector } from 'react-redux'
import { AddCashPayment, AddCustomer } from '../../redux/actions/actionsStoreProduct';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { Wrapper } from '../View/Wrapper';
import { Button } from '../Button/Button';
import { Text } from '../Text/CustomText';
import SearchInput from '../Input/SearchInput';
import MDInput, { Input as MyInput } from '../Input/MDInput';
import { Modal as AwanModal } from '../ModalContent/Popups';
import Alert from 'src/utils/alert';
import BottomSheetSelect from './BottomSheetSelect';
import { stateObject } from 'src/utils/state';
import { SizeList } from 'src/styles/size';

const height = Dimensions.get('window').height

export const WrapperItem = (props) => {
	return (
		<View style={[{ flexDirection: 'row' }, props.style]}>
			<Grid>
				<Col style={[{ justifyContent: 'center' }, props.leftStyle]}>{props.left}</Col>
				<Col style={[{ justifyContent: 'center', alignItems: 'flex-end' }, props.rightStyle]}>{props.right}</Col>
			</Grid>
		</View>
	)
}
export const RoundedToggleButton = (props) => {
	const [activeIndex, setActiveIndex] = useState(props.toggle || 0)
	useEffect(() => {
		if (props.toggle) {
			setActiveIndex(props.toggle)
		}
	})
	const _handleChangeBtn = (btn, i) => {
		setActiveIndex(i)
		props.changeToggle(i)
	}
	return props.vertical ?
		<View {...props}>
			{
				props.buttons.rMap((btn, i) => {
					return <Button key={i} onPress={() => _handleChangeBtn(btn, i)} color={activeIndex == i ? 'primary' : 'white'} noRadius {...props.buttonProps}>{btn}</Button>
				})
			}
		</View> :
		<Wrapper {...props}>
			{
				props.buttons.rMap((btn, i) => {
					return <Button noBorder={activeIndex == i ? false : true} justify="center" height={40} padding={0} width={40} key={i} onPress={() => _handleChangeBtn(btn, i)} color={activeIndex == i ? 'primary' : 'white'} {...props.buttonProps}>{btn}</Button>
				})
			}
		</Wrapper>
}
export const ToggleButton = (props) => {
	const [activeIndex, setActiveIndex] = useState(props.toggle || 0)
	useEffect(() => {
		if (props.toggle) {
			setActiveIndex(props.toggle)
		}
	})
	const _handleChangeBtn = (btn, i) => {
		setActiveIndex(i)
		props.changeToggle(i)
	}
	return props.vertical ?
		<View {...props}>
			{
				props.buttons.rMap((btn, i) => {
					return <Button key={i} onPress={() => _handleChangeBtn(btn, i)} color={activeIndex == i ? 'primary' : 'white'} noRadius {...props.buttonProps}>{btn}</Button>
				})
			}
		</View> :
		<Wrapper {...props}>
			{
				props.buttons.rMap((btn, i) => {
					return <Button key={i} onPress={() => _handleChangeBtn(btn, i)} color={activeIndex == i ? 'primary' : 'white'} noRadius {...props.buttonProps}>{btn}</Button>
				})
			}
		</Wrapper>
}
export const ToggleButtonMoney = (props) => {
	const [activeIndex, setActiveIndex] = useState()
	const dispatch = useDispatch()
	const width = 90 / props.buttons.length
	return (
		<Wrapper style={{ width: "100%" }} justify="space-between">
			{
				props.buttons.rMap((btn, i) => {
					return <Button
						onPress={() => {
							props.onPress ?
								props.onPress(btn)
								:
								setActiveIndex(i)
							dispatch(AddCashPayment(btn))
						}}
						_width={`${width}%`}
						color={activeIndex == i ? 'primary' : 'linkBorder'}
						style={[props.style]}>
						{i == 0 ? "UANG PAS" : convertRupiah(btn).toUpperCase()}
					</Button>
				})
			}
		</Wrapper>
	)
}

export const PilihPelanggan = props => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const [state, setState] = stateObject({
		search: '',
		action: 'add',
		pelanggan: {},
		pelangganVisible: false,
		isSelect: true
	})
	const { data, value } = props
	const { search, action, pelanggan, pelangganVisible, isSelect } = state

	const _handleButtonSimpan = () => {
		if (action == "add") {
			_handleAddNewCustomer()
		} else if (action == "edit") {
			_handleEditCustomer()
		}
	}
	const _handleAddNewCustomer = async () => {
		if (pelanggan) {
			if (pelanggan.name_customer == "" || pelanggan.phone_number_customer == "") {
				Alert("", "Isi semua field")
			} else {
				const data = {
					...pelanggan,
					id_store: User.store.id_store
				}
				const userToken = await getUserToken()
				await sendNewCustomer(data)
				setState({ isSelect: true })
				dispatch(getCustomer(User.store.id_store, userToken))
			}
		}
	}

	const _handleEditCustomer = async () => {
		if (pelanggan.name_customer == "" || pelanggan.phone_number_customer == "") {
			Alert("Isi semua field")
		} else {
			const data = {
				...pelanggan,
				id_store: User.store.id_store
			}
			await editCustomer(data, pelanggan.id_customer)
			setState({ isSelect: true })
			dispatch(getCustomer(User.store.id_store))
		}
	}

	const _handleDeleteCustomer = async (cust) => {
		const aa = await deleteCustomer(cust.id_customer)
		console.debug(aa)
		// dispatch(getCustomer(User.store.id_store))
	}

	const sheetContent = <View style={{ flex: 1, justifyContent: 'space-between' }}>
		<View>
			<Text align="center">{action == 'add' ? 'TAMBAH' : 'UBAH'} PELANGGAN</Text>
			<MyInput spaceBoth={SizeList.base} label="Nama pelanggan"
				value={pelanggan ? pelanggan.name_customer : ''}
				onChangeText={name_customer => setState({ pelanggan: { ...pelanggan, name_customer } })} />
			<MyInput label="No. Telepon"
				keyboardType="number-pad"
				value={pelanggan ? pelanggan.phone_number_customer : ''}
				onChangeText={phone_number_customer => setState({ pelanggan: { ...pelanggan, phone_number_customer } })} />
		</View>
		<Wrapper flexContent>
			<Button onPress={() => setState({ isSelect: true })} color="link">BATAL</Button>
			<Button onPress={_handleButtonSimpan}>SIMPAN</Button>
		</Wrapper>
	</View>

	const renderItem = item => <Wrapper style={{ flex: 1 }} justify="space-between">
		<View>
			<Text color="primary">{item.name_customer}</Text>
			<Text>{item.phone_number_customer}</Text>
		</View>
		<Wrapper justify="flex-end">
			<Icon onPress={() => _handleDeleteCustomer(item)} style={{ color: ColorsList.primaryColor }} name="trash" />
			<Icon onPress={() =>
				setState({
					isSelect: false,
					action: 'edit',
					pelanggan: item
				})
			} style={{ marginLeft: 10, color: ColorsList.primaryColor }} name="create" />
		</Wrapper>
	</Wrapper>

	const header = <MyInput
		noLabel
		renderRightAccessory={() => <Icon size={15} style={{ color: ColorsList.primary }} name="search" />}
		value={search}
		label="Cari nama atau no hp"
		onChangeText={search => setState({ search })}
	/>

	const footer = <Button onPress={() => setState({ action: 'add', isSelect: false })}>TAMBAH PELANGGAN</Button>

	return <BottomSheetSelect
		noLabel
		closeOnSelect
		height={350}
		value={value}
		isSelect={isSelect}
		onClose={() => setState({ isSelect: true, search: '' })}
		data={data.filter(item => item.name_customer.toLowerCase().includes(search.toLowerCase()))}
		handleChangePicker={item => {
			dispatch(AddCustomer(item))
		}}
		sheetContent={sheetContent}
		header={header}
		footer={footer}
		renderItem={renderItem}
	/>
}

export const PilihPelanggans = (props) => {
	const dispatch = useDispatch()
	const [action, setAction] = useState()
	const [search, setSearch] = useState('')
	const [pelanggan, setPelanggan] = useState()
	const [pelangganVisible, setPelangganVisible] = useState(false)
	const User = useSelector(state => state.User)

	const _handleButtonSimpan = () => {
		if (action == "add") {
			_handleAddNewCustomer()
		}
		else if (action == "edit") {
			_handleEditCustomer()
		}
	}
	const _handleAddNewCustomer = async () => {
		if (pelanggan) {
			if (pelanggan.name_customer == "" || pelanggan.phone_number_customer == "") {
				Alert("", "Isi semua field")
			}
			else {
				const data = {
					...pelanggan,
					id_store: User.store.id_store
				}
				const userToken = await getUserToken()
				await sendNewCustomer(data)
				setPelangganVisible(false)
				dispatch(getCustomer(User.store.id_store, userToken))
			}
		}

	}

	const _handleEditCustomer = async () => {
		if (pelanggan.name_customer == "" || pelanggan.phone_number_customer == "") {
			Alert("Isi semua field")
		}
		else {
			const data = {
				...pelanggan,
				id_store: User.store.id_store
			}
			await editCustomer(data, pelanggan.id_customer)
			setPelangganVisible(false)
			dispatch(getCustomer(User.store.id_store))
		}
	}

	const _handleDeleteCustomer = async (cust) => {
		await deleteCustomer(cust.id_customer)
		dispatch(getCustomer(User.store.id_store))
	}
	return (
		<MyModal onRequestClose={props.onRequestClose} visible={props.visible}
			body={
				<View style={{ padding: 15 }}>
					{/* Modal AddEditPelanggan */}
					<MyModal visible={pelangganVisible} backdropDismiss={false} body={
						<View style={{ padding: 15 }}>
							<Text size={20} align="center">{action == 'add' ? 'Tambah Pelanggan' : 'Edit Pelanggan'}</Text>
							<MDInput label="Nama pelanggan" width="100%"
								value={pelanggan ? pelanggan.name_customer : ''}
								keyboardType={props.keyboardType || "default"}
								onChangeText={(nama) => setPelanggan({ ...pelanggan, name_customer: nama })} />
							<MDInput label="No. Telepon" width="100%"
								value={pelanggan ? pelanggan.phone_number_customer : ''}
								keyboardType={props.keyboardType || "default"}
								onChangeText={(notelp) => setPelanggan({ ...pelanggan, phone_number_customer: notelp })} />
							<Wrapper style={{ paddingTop: 15 }} justify="flex-end">
								<Button style={{ marginRight: 10 }} onPress={() => setPelangganVisible(false)} color="link">BATAL</Button>
								<Button onPress={_handleButtonSimpan}>SIMPAN</Button>
							</Wrapper>
						</View>
					} />
					<Text size={20} align="center">Pilih Pelanggan</Text>
					<SearchInput clear={() => setSearch('')}>
						<TextInput disabled={props.disabled || false}
							value={search}
							placeholder="Cari nama atau no hp"
							keyboardType={props.keyboardType || "default"}
							onChangeText={text => setSearch(text)} />
					</SearchInput>
					<FlatList
						showsVerticalScrollIndicator={false}
						data={props.data.filter(item => item.name_customer.toLowerCase().includes(search.toLowerCase()))}
						renderItem={({ item }) => <TouchableOpacity onPress={() => {
							dispatch(AddCustomer(item))
							props.dismiss()
						}}>
							<Wrapper justify="space-between">
								<View>
									<Text color="primary">{item.name_customer}</Text>
									<Text>{item.phone_number_customer}</Text>
								</View>
								<Wrapper justify="flex-end">
									<Icon onPress={() => _handleDeleteCustomer(item)} style={{ color: ColorsList.primaryColor }} name="trash" />
									<Icon onPress={() => {
										setAction('edit')
										setPelanggan(item)
										setPelangganVisible(true)
									}} style={{ marginLeft: 10, color: ColorsList.primaryColor }} name="create" />
								</Wrapper>
							</Wrapper>
						</TouchableOpacity>}
						keyExtractor={(item, index) => index.toString()}
					/>
					<Wrapper style={{ marginTop: 15 }} justify="flex-end">
						<Button onPress={props.dismiss} color="link">BATAL</Button>
						<Button style={{ marginLeft: 10 }} onPress={() => {
							setAction('add')
							setPelanggan({ nama: '', notelp: '' })
							setPelangganVisible(true)
						}}>TAMBAH</Button>
					</Wrapper>
				</View>
			}
			backdropDismiss={false}
		/>
	)
}

export const MyModal = (props) => {
	return (
		<Modal
			onShow={props.onShow}
			style={[{}, props.style]}
			animationType="slide"
			transparent={true}
			visible={props.visible}
			onRequestClose={props.onClose}>
			<TouchableOpacity style={styles.modalBackDrop} disabled={!props.backdropDismiss ? true : false} onPress={!props.backdropDismiss ? null : props.backdropDismiss}>
				<View style={styles.modalView}>
					<Card styles={styles.modalCard}>
						{props.body}
					</Card>
				</View>
			</TouchableOpacity>
		</Modal>
	)
}
export const SelectBoxModal = props => <BottomSheetSelect {...props} />

const styles = StyleSheet.create({
	modalBackDrop: { backgroundColor: 'rgba(0,0,0,.5)', width: '100%', height: '100%' },
	modalView: { flex: 1, justifyContent: "center", padding: 20 },
	modalCard: { paddingVertical: 40, paddingHorizontal: 20 },
	modalCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	selectBox: { width: '100%' },
	selectBoxLabel: { padding: 0, margin: 0 },
	selectBoxInput: { margin: 0, padding: 0 },
	selectBoxIconDown: { color: ColorsList.greyFont, marginBottom: 8 },

	viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-start' },
	buttonSimpan: { margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor, borderRadius: 5 },
	buttonBatal: { elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30, },
})