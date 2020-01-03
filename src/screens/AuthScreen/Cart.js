import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { convertRupiah } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { addDiscountProductPersen, AddDiscountName, ChangeCartQuantity, RemoveCartProduct, AddDiscountRupiah, addDiscountProductRupiah, AddDiscountPersen, changeTransactionDiscount } from '../../redux/actions/actionsStoreProduct';
import { BottomButton } from '../../components/Button/ButtonComp';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { GlobalHeader } from '../../components/Header/Header';
import { WrapperItem, PilihPelanggan, MyModal, ToggleButton, ToggleButtonMoney } from '../../components/Picker/SelectBoxModal';
import { Icon, Item, CardItem, Grid, Col, Input, Button } from 'native-base';
import { FloatingInputLabel, FloatingInput } from '../../components/Input/InputComp';
import { FontList } from '../../styles/typography';
import { RowChild } from '../../components/Helper/RowChild';
import SwitchButton from '../../components/Button/SwitchButton';
import { SizeList } from '../../styles/size';

const width = Dimensions.get('window').width

const Cart = ({ navigation }) => {
	const dispatch = useDispatch()
	const Product = useSelector(state => state.Product)
	const User = useSelector(state => state.User)
	const Customer = useSelector(state => state.Customer)
	const [pilihPelangganOpen, setPilihPelangganOpen] = useState(false)
	const [editPesananOpen, setEditPesananOpen] = useState(false)
	const [pesanan, setPesanan] = useState({})
	const [toggle, setToggle] = useState(0)
	const [discount_type, setDiscountType] = useState(0)

	const _editPesanan = (index, item) => {
		setEditPesananOpen(true);
		setPesanan(item)
	}

	const _handleChangeToggle = () => {
		dispatch(changeTransactionDiscount())
		dispatch(AddDiscountPersen(0))
		dispatch(AddDiscountRupiah(0))
	}

	const _handleChangeDiscountItem = (text) => {
		if (toggle == 0) {
			if (text > 0 && text < (parseInt(pesanan.price_out_product) * parseInt(pesanan.quantity))) {
				dispatch(addDiscountProductRupiah({ item: pesanan, besar_diskon: text }))
			} else {
				dispatch(addDiscountProductRupiah({ item: pesanan, besar_diskon: '' }))
			}
		} else {
			if (text > 0 && text < 100) {
				dispatch(addDiscountProductPersen({ item: pesanan, besar_diskon: text }))
			} else {
				dispatch(addDiscountProductPersen({ item: pesanan, besar_diskon: '' }))
			}
		}
	}

	const _handleChangeDiskonValue = (num) => {
		if (discount_type == 1) {
			if (num < 100 && num > 0) {
				dispatch(AddDiscountPersen(num))
			} else {
				dispatch(AddDiscountPersen(''))
			}
		} else {
			if (num > 0 && num < (Product.total - Product.total_diskon)) {
				dispatch(AddDiscountRupiah(num))
			} else {
				dispatch(AddDiscountRupiah(''))
			}
		}
	}
	return (
		<View style={{ backgroundColor: ColorsList.authBackground, flex: 1 }}>
			<GlobalHeader title="Detail Pesanan" onPressBack={() => navigation.goBack()} />
			<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 50 }}>
				<PilihPelanggan action={(action, pelanggan) => {
					console.log(action, pelanggan)
				}} visible={pilihPelangganOpen} data={Customer.data} dismiss={() => setPilihPelangganOpen(false)} />

				<MyModal onRequestClose={() => { }} visible={editPesananOpen}
					body={
						<View>
							<CardItem style={{ height: 100 }}>
								<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
									<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{pesanan.name_product}</Text>,
									<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(pesanan.price_out_product)} x {pesanan.quantity}</Text>
								]} right={[
									<Text style={{ height: '100%', textAlignVertical: 'center', color: ColorsList.greyFont }}>{convertRupiah(Number(pesanan.price_out_product) * pesanan.quantity)}</Text>
								]} />
							</CardItem>
							<CardItem>
								<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={
									<View style={{ width: width - 100 - 150 }}>
										<FloatingInputLabel
											handleChangeText={_handleChangeDiscountItem}
											label="Diskon" value={editPesananOpen ? toggle == 0 ? pesanan.discount_total.toString() : pesanan.discount_persen.toString() : null} />

									</View>
								} right={
									<View style={{ width: 100 }}>
										<ToggleButton
											toggle={toggle}
											buttons={["Rp", "%"]}
											changeToggle={(i) => {
												setToggle(i)
											}}
										/>
									</View>
								} />
							</CardItem>
							<CardItem>
								<Grid>
									<Col size={2} style={{ alignItems: 'flex-end' }}>
										<Icon onPress={() => {
											if (pesanan.quantity > 1) {
												setPesanan({ ...pesanan, quantity: Number(pesanan.quantity) - 1 })
											}
										}} style={{ width: 85, fontSize: 70, color: ColorsList.primaryColor }} name="remove-circle-outline" />

									</Col>
									<Col size={1} style={{ alignItems: 'center' }}>
										{/* <Text>{JSON.stringify(pesanan.quantity)}</Text> */}
										<Input keyboardType="numeric" onChangeText={text => {
											let a = Number(text)
											if ((a > 0 && a < pesanan.stock)) {
												setPesanan({ ...pesanan, quantity: text })
											}
										}} value={pesanan.quantity ? pesanan.quantity.toString() : ''} />
									</Col>
									<Col size={2} style={{ alignItems: 'flex-start' }}>
										<Icon onPress={() => {
											if (pesanan.manage_stock == 1) {
												if (pesanan.quantity < pesanan.stock) {
													setPesanan({ ...pesanan, quantity: Number(pesanan.quantity) + 1 })
												}
											} else {
												setPesanan({ ...pesanan, quantity: Number(pesanan.quantity) + 1 })
											}
										}} style={{ width: 85, fontSize: 70, color: ColorsList.primaryColor }} name="add-circle" />

									</Col>
								</Grid>
							</CardItem>
							<CardItem footer>
								<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={
									<Icon onPress={() => {
										setEditPesananOpen(false)
										dispatch(RemoveCartProduct(pesanan))
									}} style={{ width: 85, fontSize: 50, color: ColorsList.primaryColor }} name="trash" />
								} right={
									<View style={{ flexDirection: 'row' }}>
										<Button style={styles.buttonBatal} onPress={() => setEditPesananOpen(false)}>
											<Text>Batal</Text>
										</Button>
										<Button onPress={() => {
											setEditPesananOpen(false)
											dispatch(ChangeCartQuantity(pesanan))
										}} style={styles.buttonSimpan}>
											<Text style={{ color: 'white' }}>Simpan</Text>
										</Button>
									</View>
								} />
							</CardItem>
						</View >
					}
					backdropDismiss={false}
				/>

				<View style={{ padding: 15 }}>
					<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
						{
							Product.belanja.map((data, i) => {
								return (
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
										<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.name_product}</Text>,
										<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price_out_product)} x {data.quantity}</Text>,
										data.discount_total == 0 ? null : <Text style={{ color: ColorsList.greyFont }}>Diskon {data.discount_rupiah ? convertRupiah(data.discount_total) : data.discount_persen + "%"}</Text>

									]} right={[
										<Icon onPress={() => _editPesanan(i, data)} style={{ color: ColorsList.primaryColor }} name="create" />,
										<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price_out_product * data.quantity)}</Text>,
										data.discount_total == 0 ? null : <Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.discount_total)}</Text>
									]} />
								)
							})
						}
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
							<Text style={{ ...FontList.subtitleFontGreyBold }}>Subtotal</Text>,
						]} right={
							<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(Product.total)}</Text>
						} />
						{Product.total_diskon == 0 ? null :
							<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
								<Text style={{ ...FontList.subtitleFontGreyBold }}>Total diskon</Text>,
							]} right={
								<Text style={{ ...FontList.subtitleFontGreyBold, color: ColorsList.danger }}>- {convertRupiah(Product.total_diskon)}</Text>
							} />}
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
							<Text style={{ ...FontList.subtitleFontGreyBold }}>Total</Text>,
						]} right={
							Product.total - Product.total_diskon < 0 ?
							<Text style={{ ...FontList.subtitleFontGreyBold, color: ColorsList.danger }}>- {convertRupiah(Product.total - Product.total_diskon)}</Text>
							:
							<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(Product.total - Product.total_diskon)}</Text>
						} />
					</View>
					<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
							<Item style={{ borderColor: 'transparent' }}>
								<Icon style={{ color: ColorsList.primaryColor }} name="contact" />
								<Text style={{ ...FontList.subtitleFontGreyBold }}>{Product.customer ? Product.customer.name_customer : "Pilih pelanggan"}</Text>
							</Item>
						]} right={
							<Icon onPress={() => setPilihPelangganOpen(true)} style={{ color: ColorsList.primaryColor }} name="add" />
						} />
					</View>
					<View style={styles.groupingStyle}>
						<View style={styles.wrapSwitchAndText}>
							<Text style={{ ...FontList.titleFont, color: ColorsList.greyFont }}>Diskon</Text>
							<SwitchButton
								handleChangeToggle={_handleChangeToggle}
								toggleValue={Product.discount_on}
							/>
						</View>
						{Product.discount_on ?
							<View>
								<View style={{ height: 1, backgroundColor: "#e0dada" }} />
								<View style={styles.wrapInputHarga}>
									<FloatingInputLabel
										label="Nama diskon"
										value={Product.discount_name}
										handleChangeText={text => dispatch(AddDiscountName(text))}
									/>
									<View style={{ marginTop: 10 }}>
										<FloatingInput label="Diskon">
											<TextInput value={discount_type == 0 ? Product.discount_total_rupiah : Product.discount_total_persen }
												style={{ width: '80%' }}
												keyboardType="number-pad"
												onChangeText={_handleChangeDiskonValue}
											/>
											<View style={{ width: '20%' }}>
												<ToggleButton
													buttons={["Rp", "%"]}
													changeToggle={(i) => {
														setDiscountType(i)
														dispatch(AddDiscountRupiah(0))
														dispatch(AddDiscountPersen(0))
													}}
												/>
											</View>
										</FloatingInput>
									</View>
								</View>
							</View>
							: null}

					</View>
					<View style={[{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }, { padding: 10, paddingHorizontal: 15 }]}>
						<FloatingInputLabel label="Catatan Pembelian" placeholder="Masukkan catatan pembelian disini" />
					</View>
				</View>
			</ScrollView>
			<View style={styles.absoluteButton}>
				<BottomButton
					onPressBtn={() => {
						if (Product.jumlahitem > 0) {
							navigation.navigate('/cashier/check-out')
							dispatch(getCustomer(User.store.id_store))
						} else {
							alert("Keranjang anda kosong")
						}
					}}
					style={{ width: SizeList.width - 30, backgroundColor: ColorsList.primaryColor }}
					buttonTitle="LANJUTKAN"
				/>
			</View>

		</View>
	);
}

export default Cart


const styles = StyleSheet.create({

	viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-start' },
	buttonSimpan: { margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor, borderRadius: 5 },
	buttonBatal: { elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30, },

	childContainer: {
		paddingHorizontal: 20,
		backgroundColor: ColorsList.authBackground,
		flex: 1,
		justifyContent: "space-between"
	},
	infoText: {
		...FontList.titleFont,
		color: ColorsList.greyFont,
		fontSize: 16
	},
	wrapInputHarga: {
		paddingHorizontal: 10,
		marginBottom: 10
	},
	inputTwoCol: {
		flex: 1
	},
	wrapSwitchAndText: {
		...RowChild,
		justifyContent: 'space-between',
		padding: 10
	},
	absoluteButton: {
		position: "absolute",
		bottom: 15,
		alignSelf: "center"
	},
	notifInfo: {
		...FontList.subtitleFont,
		marginLeft: 15
	},
	groupingStyle: {
		backgroundColor: 'white',
		borderRadius: 10,
		marginBottom: 10,
	}
})