import { Item, Input, Icon, Card, CardItem, Body, Grid, Col } from 'native-base';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, FlatList, TextInput } from 'react-native-gesture-handler';
import { FloatingInputLabel, FloatingInput } from '../Input/InputComp';
import { ColorsList } from '../../styles/colors';
import { convertRupiah, sendNewCustomer, editCustomer, deleteCustomer } from '../../utils/authhelper';
import { useDispatch, useSelector } from 'react-redux'
import { AddCashPayment, AddCustomer } from '../../redux/actions/actionsStoreProduct';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { Wrapper } from '../View/Wrapper';
import { Button } from '../Button/Button';
import { Text } from '../Text/CustomText';
import SearchInput from '../Input/SearchInput';
import MDInput from '../Input/MDInput';
import { Modal as AwanModal } from '../ModalContent/Popups';
import { $Padding, $Border } from 'src/utils/stylehelper';

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
				props.buttons.map((btn, i) => {
					return <Button key={i} onPress={() => _handleChangeBtn(btn, i)} color={activeIndex == i ? 'primary' : 'white'} noRadius {...props.buttonProps}>{btn}</Button>
				})
			}
		</View> :
		<Wrapper {...props}>
			{
				props.buttons.map((btn, i) => {
					return <Button key={i} onPress={() => _handleChangeBtn(btn, i)} color={activeIndex == i ? 'primary' : 'white'} noRadius {...props.buttonProps}>{btn}</Button>
				})
			}
		</Wrapper>
}
export const ToggleButtonMoney = (props) => {
	const [activeIndex, setActiveIndex] = useState()
	const dispatch = useDispatch()
	const width = 100 / props.buttons.length
	return (
		<Wrapper>
			{
				props.buttons.map((btn, i) => {
					return <Button
						onPress={() => {
							props.onPress ?
								props.onPress(btn)
								:
								setActiveIndex(i)
							dispatch(AddCashPayment(btn))
						}}
						_width={`${width}%`}
						color={activeIndex == i ? 'primary' : 'white'} style={props.style}>
						{i == 0 ? "UANG PAS" : convertRupiah(btn).toUpperCase()}
					</Button>
				})
			}
		</Wrapper>
	)
}

export const PopupDetailPesanan = (props) => {
	const width = Dimensions.get('window').width
	return (
		<MyModal onRequestClose={props.onRequestClose} visible={props.visible}
			body={
				<View>
					<CardItem style={{ height: 100 }}>
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
							<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>Nama Produk</Text>,
							<Text style={{ color: ColorsList.greyFont }}>Rp. 25.000 x 2</Text>
						]} right={[
							<Text style={{ height: '100%', textAlignVertical: 'center', color: ColorsList.greyFont }}>Rp. 50.000</Text>
						]} />
						<Grid>
							<Col style={{ paddingRight: 10 }}>
								<Body>
									<Text style={{ color: ColorsList.primaryColor, fontWeight: 'bold' }}>Nama Produk</Text>
									<Text note>Rp. 25.000 x 2</Text>
								</Body>
							</Col>
							<Col size={.5}>
								<Text>Rp. 50.000</Text>
							</Col>
						</Grid>
					</CardItem>
					<CardItem>
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={
							<View style={{ width: width - 100 - 150 }}>
								<FloatingInputLabel label="Diskon" value={props.value} />
							</View>
						} right={
							<View style={{ width: 100 }}>
								<ToggleButton buttons={["Rp", "%"]} />
							</View>
						} />
					</CardItem>
					<CardItem>
						<Grid>
							<Col size={2} style={{ alignItems: 'flex-end' }}>
								<TouchableOpacity >
									<Icon style={{ width: 85, fontSize: 100, color: ColorsList.primaryColor }} name="remove-circle-outline" />
								</TouchableOpacity>
							</Col>
							<Col size={1} style={{ alignItems: 'center' }}>
								<Input label="Barcode Number" value="1" />
							</Col>
							<Col size={2} style={{ alignItems: 'flex-start' }}>
								<TouchableOpacity>
									<Icon style={{ width: 85, fontSize: 100, color: ColorsList.primaryColor }} name="add-circle" />
								</TouchableOpacity>
							</Col>
						</Grid>
					</CardItem>
					<CardItem footer>
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={
							<Icon style={{ width: 85, fontSize: 50, color: ColorsList.primaryColor }} name="trash" />
						} right={
							<View style={{ flexDirection: 'row' }}>
								<Button style={styles.buttonBatal} onPress={props.dismiss}>
									<Text>Batal</Text>
								</Button>
								<Button style={styles.buttonSimpan}>
									<Text style={{ color: 'white' }}>Simpan</Text>
								</Button>
							</View>
						} />
					</CardItem>
				</View >
			}
			backdropDismiss={false}
		/>
	)
}

export const PilihPelanggan = (props) => {
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
				alert("Isi semua field")
			}
			else {
				const data = {
					...pelanggan,
					id_store: User.store.id_store
				}
				await sendNewCustomer(data)
				setPelangganVisible(false)
				dispatch(getCustomer(User.store.id_store))
			}
		}

	}

	const _handleEditCustomer = async () => {
		if (pelanggan.name_customer == "" || pelanggan.phone_number_customer == "") {
			alert("Isi semua field")
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
							<FloatingInput label="Nama pelanggan">
								<TextInput width="100%"
									value={pelanggan ? pelanggan.name_customer : ''}
									keyboardType={props.keyboardType || "default"}
									onChangeText={(nama) => setPelanggan({ ...pelanggan, name_customer: nama })} />
							</FloatingInput>
							<FloatingInput label="No. Telepon">
								<TextInput width="100%"
									value={pelanggan ? pelanggan.phone_number_customer : ''}
									keyboardType={props.keyboardType || "default"}
									onChangeText={(notelp) => setPelanggan({ ...pelanggan, phone_number_customer: notelp })} />
							</FloatingInput>
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

export const SelectBoxModal = (props) => {
	const [activeColor, setActiveColor] = useState('grey');
	const [modalVisible, setModalVisible] = useState(false);
	return <View>
		<AwanModal visible={modalVisible}
			backdropDismiss={() => setModalVisible(false)}
			style={{
				width: '90%',
				height: 500,
				padding: 10
			}}>
			{props.header}
			<ScrollView persistentScrollbar style={{ height: '30%' }}>{
				props.data.length > 0 ? props.data.map((item) => {
					return <CardItem style={styles.modalCardItem} button onPress={() => {
						props.handleChangePicker(item)
						props.closeOnSelect ? setModalVisible(false) : null
					}}>
						{props.renderItem(item)}
					</CardItem>
				}) : props.children
			}
			</ScrollView>
			{props.footer}
		</AwanModal>
		<TouchableOpacity activeOpacity={.7} onPress={() => setModalVisible(true)} style={[styles.selectBox, props.style, {
			marginTop: 5
		}]}>
			<Text font="Regular" style={{ color: props.value ? ColorsList.greyFont : ColorsList.transparent }}>{props.label}</Text>
			<Wrapper justify="space-between" style={$Border(ColorsList.secondary, 0, 0, .5)}>
				<Text font="Regular" size={13}>{props.value}</Text>
				<Icon name='arrow-dropdown' style={styles.selectBoxIconDown} />
			</Wrapper>
		</TouchableOpacity>
	</View>
}

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