import { Item, Input, Icon, Label, Card, CardItem, Button, Left, Thumbnail, Body, Grid, Col } from 'native-base';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, FlatList, TextInput } from 'react-native-gesture-handler';
import { FloatingInputLabel, FloatingInput } from '../Input/InputComp';
import { ColorsList } from '../../styles/colors';
import { RowChild } from '../Helper/RowChild';
import { convertRupiah, sendNewCustomer, editCustomer, deleteCustomer } from '../../utils/authhelper';
import { useDispatch, useSelector } from 'react-redux'
import { AddCashPayment, AddCustomer } from '../../redux/actions/actionsStoreProduct';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { FontList } from '../../styles/typography';
import { SizeList } from '../../styles/size';
import { Wrapper } from '../View/Wrapper';

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
	return (
		<Item style={{ width: '100%' }}>
			{
				props.buttons.map((btn, i) => {
					return (
						<Button onPress={() => _handleChangeBtn(btn, i)} style={[props.style,
						{ padding: 5, flex: 1, justifyContent: 'center' },
						{ backgroundColor: activeIndex == i ? ColorsList.primaryColor : '#dedede' },
						props.style
						]}>
							<Text style={
								{ fontFamily: FontList.boldFont, color: activeIndex == i ? 'white' : ColorsList.greySoft }
							}>{btn}</Text>
						</Button>
					)
				})
			}
		</Item>
	)
}

export const ToggleButtonMoney = (props) => {
	const [activeIndex, setActiveIndex] = useState()
	const dispatch = useDispatch()
	return (
		<Item style={{ width: '100%' }}>
			{
				props.buttons.map((btn, i) => {
					return (
						<Button onPress={() => {
							props.onPress ?
								props.onPress(btn)
								:
								setActiveIndex(i)
							dispatch(AddCashPayment(btn))
						}} style={[props.style,
						{ padding: 5, flex: 1, justifyContent: 'center' },
						{ backgroundColor: activeIndex == i ? ColorsList.primaryColor : 'white' },
						props.style
						]}>
							<Text style={
								{ fontFamily: 'Nunito-Bold', color: activeIndex == i ? 'white' : ColorsList.primaryColor }
							}>{i == 0 ? "UANG PAS" : convertRupiah(btn).toUpperCase()}</Text>
						</Button>
					)
				})
			}
		</Item>
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
								<TouchableOpacity style={{}}>
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
				<View>
					{/* Modal AddEditPelanggan */}
					<MyModal visible={pelangganVisible} backdropDismiss={false} body={
						<View>
							<CardItem header style={{ justifyContent: 'center' }}>
								<Text style={{ ...FontList.subtitleFontGreyBold, fontSize: 18 }}>{action == 'add' ? 'Tambah Pelanggan' : 'Edit Pelanggan'}</Text>
							</CardItem>
							<CardItem>
								<Item style={{ width: '100%', borderBottomColor: ColorsList.primaryColor, borderBottomWidth: 1 }}>
									<FloatingInput left={30} borderTransparent label="Nama pelanggan">
										<Icon style={{ color: ColorsList.primary }} name="search" />
										<TextInput width="90%"
											value={pelanggan ? pelanggan.name_customer : ''}
											keyboardType={props.keyboardType || "default"}
											onChangeText={(nama) => setPelanggan({ ...pelanggan, name_customer: nama })} />
									</FloatingInput>
								</Item>
							</CardItem>
							<CardItem>
								<Item style={{ width: '100%', borderBottomColor: ColorsList.primaryColor, borderBottomWidth: 1 }}>
									<FloatingInput left={30} borderTransparent label="No. Telepon">
										<Icon style={{ color: ColorsList.primary }} name="search" />
										<TextInput width="90%"
											value={pelanggan ? pelanggan.phone_number_customer : ''}
											keyboardType={props.keyboardType || "default"}
											onChangeText={(notelp) => setPelanggan({ ...pelanggan, phone_number_customer: notelp })} />
									</FloatingInput>
								</Item>
							</CardItem>
							<CardItem footer style={styles.viewButtonPopup}>
								<Button onPress={_handleButtonSimpan} style={styles.buttonSimpan}>
									<Text style={{ ...FontList.subtitleFontGreyBold, color: 'white' }}>SIMPAN</Text>
								</Button>
								<Button onPress={() => setPelangganVisible(false)} style={styles.buttonBatal}>
									<Text style={{ ...FontList.subtitleFontGreyBold }}>BATAL</Text>
								</Button>
							</CardItem>
						</View>
					} />
					<CardItem header style={{ justifyContent: 'center' }}>
						<Text style={{ ...FontList.subtitleFontGreyBold, fontSize: 20 }}>Pilih Pelanggan</Text>
					</CardItem>
					<CardItem>
						<Item style={{ width: '100%', borderBottomColor: ColorsList.primaryColor, borderBottomWidth: 1 }}>
							<Icon name="search" style={{ color: ColorsList.greyFont }} />
							<Input
								disabled={props.disabled || false}
								value={search}
								placeholder="Cari nama atau no hp"
								keyboardType={props.keyboardType || "default"}
								onChangeText={text => setSearch(text)}
								style={{ fontFamily: FontList.regularFont, color: ColorsList.greyFont }}
							/>
						</Item>
					</CardItem>
					<View style={{ height: SizeList.height / 5, paddingHorizontal: 20 }}>
						<FlatList
							showsVerticalScrollIndicator={false}
							data={props.data.filter(item => item.name_customer.toLowerCase().includes(search.toLowerCase()))}
							renderItem={({ item }) => (
								<TouchableOpacity onPress={() => {
									dispatch(AddCustomer(item))
									props.dismiss()
								}}>
									<WrapperItem left={[
										<Text style={{ ...FontList.titleFont, color: ColorsList.primaryColor }}>{item.name_customer}</Text>,
										<Text style={{ ...FontList.subtitleFont, fontSize: 12, color: ColorsList.greyFont }} note>{item.phone_number_customer}</Text>
									]} right={
										<View style={{ flexDirection: 'row-reverse', width: 75, alignItems: 'center', flex: 1 }}>
											<WrapperItem left={
												<Icon onPress={() => _handleDeleteCustomer(item)} style={{ color: ColorsList.primaryColor }} name="trash" />
											} right={
												<Icon onPress={() => {
													setAction('edit')
													setPelanggan(item)
													setPelangganVisible(true)
												}} style={{ color: ColorsList.primaryColor }} name="create" />
											} />
										</View>
									} />
								</TouchableOpacity>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
					<CardItem footer style={styles.viewButtonPopup}>
						<Button onPress={() => {
							setAction('add')
							setPelanggan({ nama: '', notelp: '' })
							setPelangganVisible(true)
						}} style={styles.buttonSimpan}>
							<Text style={{ ...FontList.subtitleFontGreyBold, color: 'white' }}>TAMBAH</Text>
						</Button>
						<Button onPress={props.dismiss} style={styles.buttonBatal}>
							<Text style={{ ...FontList.subtitleFontGreyBold, }}>BATAL</Text>
						</Button>
					</CardItem>
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
	return (
		<View>
			<MyModal visible={modalVisible} backdropDismiss={() => setModalVisible(false)} body={[
				props.header ? <CardItem header>
					{props.header}
				</CardItem> : null,
				<ScrollView style={{ height: '30%' }}>{
					props.data.length > 0 ? props.data.map((item) => {
						return (
							<CardItem style={styles.modalCardItem} button onPress={() => {
								props.handleChangePicker(item)
								props.closeOnSelect ? setModalVisible(false) : null
							}}>
								{props.renderItem(item)}
							</CardItem>
						)
					}) : <CardItem style={styles.modalCardItem}>
							{props.children}
						</CardItem>
				}
				</ScrollView>,
				props.footer ?
					<CardItem footer>
						{props.footer}
					</CardItem> : null
			]} />
			<TouchableOpacity activeOpacity={.7} onPress={() => setModalVisible(true)} style={[styles.selectBox, { borderBottomWidth: 1, width: '100%', borderBottomColor: activeColor, borderColor: activeColor }, props.style]}>
				<Wrapper justify="space-between">
					<FloatingInput borderTransparent label={props.label} _width="90%">
						<TextInput style={{ color: ColorsList.black }} value={props.value} editable={false} />
					</FloatingInput>
					<Icon name='arrow-dropdown' style={styles.selectBoxIconDown} />
				</Wrapper>
			</TouchableOpacity>
		</View >
	);
}

const styles = StyleSheet.create({
	modalBackDrop: { backgroundColor: 'rgba(0,0,0,.5)', width: '100%', height: '100%' },
	modalView: { flex: 1, justifyContent: "center", padding: 20 },
	modalCard: { paddingVertical: 40, paddingHorizontal: 20 },
	modalCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	selectBox: { width: '100%' },
	selectBoxLabel: { padding: 0, margin: 0 },
	selectBoxInput: { margin: 0, padding: 0 },
	selectBoxIconDown: { color: 'black' },

	viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-start' },
	buttonSimpan: { margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor, borderRadius: 5 },
	buttonBatal: { elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30, },
})