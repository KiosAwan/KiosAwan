import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { convertRupiah } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { addDiscountProductPersen, resetTotalDiskon, ChangeCartQuantity, RemoveCartProduct, AddDiscountRupiah, addDiscountProductRupiah, AddDiscountPersen, changeTransactionDiscount, removeAllCart } from '../../redux/actions/actionsStoreProduct';
import { BottomButton } from '../../components/Button/ButtonComp';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { GlobalHeader } from '../../components/Header/Header';
import { WrapperItem, PilihPelanggan, ToggleButton } from '../../components/Picker/SelectBoxModal';
import { Icon, Item } from 'native-base';
import { FloatingInputLabel, FloatingInput } from '../../components/Input/InputComp';
import { FontList } from '../../styles/typography';
import { RowChild } from '../../components/Helper/RowChild';
import SwitchButton from '../../components/Button/SwitchButton';
import { SizeList } from '../../styles/size';
import { Wrapper } from 'src/components/View/Wrapper';
import { Modal, AwanPopup } from 'src/components/ModalContent/Popups';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { ImageAuto, Image } from 'src/components/CustomImage';

const width = Dimensions.get('window').width

const Cart = ({ navigation }) => {
	const dispatch = useDispatch()
	const Product = useSelector(state => state.Product)
	const User = useSelector(state => state.User)
	const Customer = useSelector(state => state.Customer)
	const [pilihPelangganOpen, setPilihPelangganOpen] = useState(false)
	const [editPesananOpen, setEditPesananOpen] = useState(false)
	const [hapusPesananOpen, setHapusPesananOpen] = useState(false)
	const [pesanan, setPesanan] = useState({})
	const [toggle, setToggle] = useState(0)
	const [discount_type, setDiscountType] = useState(0)

	const _editPesanan = (index, item) => {
		setEditPesananOpen(true);
		setPesanan(item)
	}

	const _prompDeletePesanan = (index, item) => {
		// setPesanan(item)
		setHapusPesananOpen(true)
		setConfirm({
			title: 'Hapus dari cart?',
			action: () => _deletePesanan(item)
		})
	}
	const _deletePesanan = pesanan => {
		setHapusPesananOpen(false)
		dispatch(RemoveCartProduct(pesanan))
		if (Product.belanja.length <= 1) navigation.goBack()
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
	const _quantityControl = control => {
		if (control == 'add') {
			if (pesanan.manage_stock == 1) {
				if (pesanan.quantity < pesanan.stock) {
					setPesanan({ ...pesanan, quantity: Number(pesanan.quantity) + 1 })
				}
			} else {
				setPesanan({ ...pesanan, quantity: Number(pesanan.quantity) + 1 })
			}
		} else {
			if (pesanan.quantity > 1) {
				setPesanan({ ...pesanan, quantity: Number(pesanan.quantity) - 1 })
			}
		}
	}
	const [confirm, setConfirm] = useState({})
	const _emptyCart = (force) => {
		if (force) {
			Product.belanja.forEach(item => dispatch(RemoveCartProduct(item)))
			dispatch(AddDiscountPersen(''))
			dispatch(AddDiscountRupiah(''))
			dispatch(resetTotalDiskon(''))
			setHapusPesananOpen(false)
			navigation.goBack()
		} else {
			setConfirm({
				title: 'Batalkan transaksi?',
				action: () => _emptyCart(true)
			})
			setHapusPesananOpen(true)
		}
	}
	return (
		<View style={{ backgroundColor: ColorsList.authBackground, flex: 1 }}>
			<GlobalHeader
				title="Detail Pesanan"
				onPressBack={() => navigation.goBack()} />
			<PilihPelanggan action={(action, pelanggan) => {
				console.log(action, pelanggan)
			}} visible={pilihPelangganOpen} data={Customer.data} dismiss={() => setPilihPelangganOpen(false)} />
			<AwanPopup.NoTitle visible={hapusPesananOpen} message={confirm.title}>
				<Button width="35%" onPress={() => setHapusPesananOpen(false)} color="link">Tidak</Button>
				<Button width="35%" onPress={confirm.action}>Ya</Button>
			</AwanPopup.NoTitle>
			<Modal style={{ padding: 10 }} visible={editPesananOpen}>
				<Wrapper style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} justify="space-between">
					<View _width="70%">
						<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{pesanan.name_product}</Text>
						<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(pesanan.price_out_product)} x {pesanan.quantity}</Text>
					</View>
					<Text _style={{ width: '30%', alignItems: 'flex-end' }} style={{ textAlignVertical: 'center', color: ColorsList.greyFont }}>{convertRupiah(Number(pesanan.price_out_product) * pesanan.quantity)}</Text>
				</Wrapper>
				<Wrapper justify="space-between">
					<FloatingInput width="70%" label="Diskon">
						<TextInput keyboardType="number-pad" onChangeText={_handleChangeDiscountItem}
							value={editPesananOpen ? toggle == 0 ? pesanan.discount_total.toString() : pesanan.discount_persen.toString() : null} />
					</FloatingInput>
					<ToggleButton _width="30%"
						toggle={toggle}
						buttons={["Rp", "%"]}
						changeToggle={(i) => {
							setToggle(i)
						}}
					/>
				</Wrapper>
				<Wrapper justify="space-around" style={{ marginTop: 20 }}>
					<Icon onPress={() => _quantityControl('min')} _style={{ width: '40%', alignItems: 'flex-end' }} style={{ fontSize: 50, color: ColorsList.primaryColor }} name="remove-circle-outline" />
					<TextInput _width="10%" textAlign={'center'} keyboardType="numeric" onChangeText={text => {
						let a = Number(text)
						if ((a > 0 && a < pesanan.stock)) {
							setPesanan({ ...pesanan, quantity: text })
						}
					}} value={pesanan.quantity ? pesanan.quantity.toString() : ''} />
					<Icon onPress={() => _quantityControl('add')} _style={{ width: '40%', alignItems: 'flex-start' }} style={{ fontSize: 50, color: ColorsList.primaryColor }} name="add-circle" />
				</Wrapper>
				<Wrapper justify="flex-end" style={{ marginTop: 20 }}>
					<Button color="link" onPress={() => setEditPesananOpen(false)}>BATAL</Button>
					<Button onPress={() => {
						setEditPesananOpen(false)
						dispatch(ChangeCartQuantity(pesanan))
					}} style={styles.buttonSimpan}>
						<Text style={{ color: 'white' }}>SIMPAN</Text>
					</Button>
				</Wrapper>
			</Modal>
			<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 50 }}>
				<View style={{ padding: 15 }}>
					<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
						{
							Product.belanja.map((data, i) => {
								return <Wrapper key={i} style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} justify="space-between">
									<View _width="70%">
										<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.name_product}</Text>
										<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price_out_product)} x {data.quantity}</Text>
										{data.discount_total == 0 ? null : <Text style={{ color: ColorsList.greyFont }}>Diskon {data.discount_rupiah ? convertRupiah(data.discount_total) : data.discount_persen + "%"}</Text>}
									</View>
									<View _width="30%" style={{ alignItems: 'flex-end' }}>
										<Wrapper>
											<TouchableOpacity activeOpacity={.5} onPress={() => _prompDeletePesanan(i, data)} style={{ width: 30, height: 30 }}>
												<ImageAuto source={require('src/assets/icons/trash-primary.png')} />
											</TouchableOpacity>
											<TouchableOpacity activeOpacity={.5} onPress={() => _editPesanan(i, data)} style={{ width: 35, height: 35 }}>
												<ImageAuto source={require('src/assets/icons/edit.png')} />
											</TouchableOpacity>
										</Wrapper>
										<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price_out_product * data.quantity)}</Text>
										{data.discount_total == 0 ? null : <Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.discount_total)}</Text>}
									</View>
								</Wrapper>
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
					<Wrapper style={{ marginBottom: 10 }}>
						<Button color="white" _width="49%" onPress={() => navigation.goBack()}>
							<Image size={25} source={require('src/assets/icons/plus-primary.png')} />
							<Text color="primary">TAMBAH PRODUK</Text>
						</Button>
						<Button color="white" _width="49%" onPress={() => _emptyCart()}>
							<Image size={25} source={require('src/assets/icons/trash-primary.png')} />
							<Text color="primary">HAPUS PESANAN</Text>
						</Button>
					</Wrapper>
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
									{/* {Nama Diskon} */}
									{/* <FloatingInputLabel
										label="Nama diskon"
										value={Product.discount_name}
										handleChangeText={text => dispatch(AddDiscountName(text))}
									/> */}
									<View style={{ marginTop: 10, flexDirection: 'row' }}>
										<View style={{ width: '80%' }}>
											<FloatingInputLabel label="Diskon"
												handleChangeText={_handleChangeDiskonValue}
												value={discount_type == 0 ? Product.discount_total_rupiah : Product.discount_total_persen}
											>
											</FloatingInputLabel>
										</View>
										<View style={{ width: '20%', alignSelf: 'flex-end' }}>
											<ToggleButton
												buttons={["Rp", "%"]}
												changeToggle={(i) => {
													setDiscountType(i)
													dispatch(AddDiscountRupiah(0))
													dispatch(AddDiscountPersen(0))
												}}
											/>
										</View>

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