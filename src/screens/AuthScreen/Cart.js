import React, { useState, useEffect } from 'react';
import { View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { convertRupiah, getUserToken } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { addDiscountProductPersen, ChangeCartQuantity, RemoveCartProduct, AddDiscountRupiah, addDiscountProductRupiah, AddDiscountPersen, changeTransactionDiscount, removeAllCart, addTransactionNote, getProduct, removeProductCart } from '../../redux/actions/actionsStoreProduct';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { GlobalHeader, IconHeader } from '../../components/Header/Header';
import { PilihPelanggan, ToggleButton } from '../../components/Picker/SelectBoxModal';
import { Icon } from 'native-base';
import SwitchButton from '../../components/Button/SwitchButton';
import { Wrapper } from 'src/components/View/Wrapper';
import { Modal, AwanPopup } from 'src/components/ModalContent/Popups';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { ImageAuto, Image } from 'src/components/CustomImage';
import { Bottom } from 'src/components/View/Bottom';
import Divider from 'src/components/Row/Divider';
import { RemovePPOBFromCart } from 'src/redux/actions/actionsPPOB';
import MDInput, { Input } from 'src/components/Input/MDInput';
import AsyncStorage from 'src/utils/async-storage';
import Container, { Body } from 'src/components/View/Container';
import Alert from 'src/utils/alert';
import { SizeList } from 'src/styles/size';

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

	useEffect(() => {
		_effect()
	}, [])

	const _effect = async () => {
		const userToken = await getUserToken()
		dispatch(getCustomer(User.store.id_store, userToken))
	}

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
		//Condition if item is electronic product
		if (pesanan.productID) {
			//Action for removing electronic product from cart
			dispatch(RemovePPOBFromCart(pesanan))
		} else {
			//Action for removing cashier product from cart
			dispatch(RemoveCartProduct(pesanan))
		}
		//Condition if the cart is empty, the user will be redirect to previous screen
		if (Product.jumlahitem <= 1) navigation.goBack()
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
	const _emptyCart = async (force) => {
		if (force) {
			const userToken = await getUserToken()
			dispatch(removeProductCart())
			dispatch(getProduct(User.store.id_store, userToken))
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
	return <Container header={{
		title: "Detail Pesanan",
		onPressBack: () => navigation.goBack(),
		renderRightAccessory: () => <TouchableOpacity onPress={() => _emptyCart()}>
			<IconHeader name="trash" color={ColorsList.greyFont} />
		</TouchableOpacity>
	}}>
		<PilihPelanggan visible={pilihPelangganOpen} data={Customer.data} dismiss={() => setPilihPelangganOpen(false)} />
		<AwanPopup.NoTitle visible={hapusPesananOpen} message={confirm.title}>
			<Button width="35%" onPress={() => setHapusPesananOpen(false)} color="link">Tidak</Button>
			<Button width="35%" onPress={confirm.action}>Ya</Button>
		</AwanPopup.NoTitle>
		<Modal style={{ padding: 10 }} visible={editPesananOpen}>
			<Wrapper style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} justify="space-between">
				<View width="70%">
					<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{pesanan.name_product}</Text>
					<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(pesanan.price_out_product)} x {pesanan.quantity}</Text>
				</View>
				<Text _style={{ width: '30%', alignItems: 'flex-end' }} style={{ textAlignVertical: 'center', color: ColorsList.greyFont }}>{convertRupiah(Number(pesanan.price_out_product) * pesanan.quantity)}</Text>
			</Wrapper>
			<Wrapper justify="space-between">
				<MDInput width="70%" label="Diskon" keyboardType="number-pad" onChangeText={_handleChangeDiscountItem}
					value={editPesananOpen ? toggle == 0 ? pesanan.discount_total.toString() : pesanan.discount_persen.toString() : null} />
				<ToggleButton
					toggle={toggle}
					buttons={["Rp", "%"]}
					changeToggle={(i) => {
						setToggle(i)
					}}
				/>
			</Wrapper>
			<Wrapper justify="space-around" style={{ marginTop: 20 }}>
				<TouchableOpacity onPress={() => _quantityControl('min')} _style={{ width: '40%', alignItems: 'flex-end' }} style={{ fontSize: 50, color: ColorsList.primaryColor }}>
					<Image size={45} source={require('src/assets/icons/minusedit.png')} />
				</TouchableOpacity>
				<TextInput _width="10%" textAlign={'center'} keyboardType="numeric" onChangeText={text => {
					let a = Number(text)
					if ((a > 0 && a < pesanan.stock)) {
						setPesanan({ ...pesanan, quantity: text })
					}
				}} value={pesanan.quantity ? pesanan.quantity.toString() : ''} />
				<TouchableOpacity onPress={() => _quantityControl('add')} _style={{ width: '40%', alignItems: 'flex-start' }} style={{ fontSize: 50, color: ColorsList.primaryColor }}>
					<Image size={45} source={require('src/assets/icons/plusedit.png')} />
				</TouchableOpacity>
			</Wrapper>
			<Wrapper justify="flex-end" style={{ marginTop: 20 }}>
				<Button color="link" onPress={() => setEditPesananOpen(false)}>BATAL</Button>
				<Button onPress={() => {
					setEditPesananOpen(false)
					dispatch(ChangeCartQuantity(pesanan))
				}}>
					<Text style={{ color: 'white' }}>SIMPAN</Text>
				</Button>
			</Wrapper>
		</Modal>
		<Body showsVerticalScrollIndicator={false}>
			{Product.belanja.length > 0 ?
				<Text>Daftar Produk</Text>
				: null}
			<View style={{ marginVertical: 5, borderRadius: 5, backgroundColor: ColorsList.white, elevation: 1, padding: 5 }}>
				{
					Product.belanja.rMap((data, i) => {
						return <View>
							<Wrapper key={i} style={{ padding: 10 }} justify="space-between">
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
							<Divider />
						</View>
					})
				}
				{Product.ppob_cart.length > 0 ?
					<Text>Payment Point</Text>
					: null}
				{
					Product.ppob_cart.rMap((data, i) => {
						return <View>
							<Wrapper key={i} style={{ padding: 10 }} justify="space-between">
								<View _width="60%">
									<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.productName.toUpperCase()}</Text>
									<Text style={{ color: ColorsList.greyFont }}>{data.customerID}</Text>
								</View>
								<View _width="40%" style={{ alignItems: 'flex-end' }}>
									<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price)}</Text>
								</View>
							</Wrapper>
							<Divider />
						</View>
					})
				}
				<Wrapper justify="space-between">
					<Text style={{ padding: 10 }}>Subtotal</Text>
					<Text style={{ padding: 10 }}>{convertRupiah(Product.total)}</Text>
				</Wrapper>
				<Divider />
				{Product.total_diskon == 0 ? null :
					<View>
						<Wrapper justify="space-between">
							<Text style={{ padding: 10 }}>Total diskon</Text>
							<Text style={{ padding: 10 }} color="danger">- {convertRupiah(Product.total_diskon)}</Text>
						</Wrapper>
						<Divider />
					</View>
				}
				<Wrapper justify="space-between">
					<Text style={{ padding: 10 }} font="SemiBold">Total</Text>
					<Text style={{ padding: 10 }} font="SemiBold">{convertRupiah(Product.total - Product.total_diskon)}</Text>
				</Wrapper>

			</View>
			<View style={{ marginVertical: SizeList.base, }}>
				<Text>Apakah ada tambahan?</Text>
				<Wrapper justify="space-between" style={{ marginTop: 5 }}>
					<Button wrapper={{ justify: "center" }} color="white" noBorder _width="48%" justify="center" padding={10} onPress={async () => {
						if (Product.data.length == 0) {
							const userToken = await getUserToken()
							dispatch(getProduct(User.store.id_store, userToken))
						}
						navigation.navigate('/cashier')
					}}>
						<Text color="primary">PRODUK BARANG</Text>
					</Button>
					<Button wrapper={{ justify: "center" }} color="white" noBorder _width="48%" justify="center" padding={10} onPress={async () => {
						await AsyncStorage.put("TransactionDetailRoute", "/")
						navigation.navigate("/ppob")
					}}>
						<Text color="primary">PULSA DAN TAGIHAN</Text>
					</Button>
				</Wrapper>
			</View>
			<View style={{ marginVertical: SizeList.base, }}>
				<Text>Pelanggan</Text>
				<TouchableOpacity onPress={() => setPilihPelangganOpen(true)}>
					<Wrapper justify="space-between" style={{ borderRadius: 5, backgroundColor: ColorsList.whiteColor, padding: 10, marginTop: 5 }}>
						<Wrapper justify="flex-start">
							<Icon style={{ marginRight: 10, color: ColorsList.primaryColor }} name="contact" />
							<Text color="primary">{Product.customer ? Product.customer.name_customer : "Pilih pelanggan"}</Text>
						</Wrapper>
						<Icon style={{ color: ColorsList.primaryColor }} name="add" />
					</Wrapper>
				</TouchableOpacity>
			</View>

			<View style={{ marginVertical: SizeList.base }}>
				<Wrapper justify="space-between" style={{ padding: 10 }}>
					<Text>Tambahkan diskon</Text>
					<SwitchButton handleChangeToggle={_handleChangeToggle} toggleValue={Product.discount_on} />
				</Wrapper>
				{Product.discount_on ?
					<View style={{ backgroundColor: ColorsList.white, elevation: 1 }}>
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<MDInput _width="70%" label="Diskon" keyboardType="number-pad" value={discount_type == 0 ? Product.discount_total_rupiah : Product.discount_total_persen} onChangeText={_handleChangeDiskonValue} />
							<ToggleButton
								buttons={["Rp", "%"]}
								changeToggle={(i) => {
									setDiscountType(i)
									dispatch(AddDiscountRupiah(0))
									dispatch(AddDiscountPersen(0))
								}}
							/>
						</Wrapper>
					</View>
					: null}
			</View>
			{/* <View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5, padding: 10, paddingHorizontal: 15 }}> */}
			<Input value={Product.note} onChangeText={(text) => { dispatch(addTransactionNote(text)) }} label="Catatan Pembelian" placeholder="Masukkan catatan pembelian disini" />
			{/* </View> */}
		</Body>
		<Button style={{ margin: SizeList.base }} onPress={async () => {
			if (Product.jumlahitem > 0) {
				navigation.navigate('/cashier/check-out')
				const userToken = await getUserToken()
				dispatch(getCustomer(User.store.id_store, userToken))
			} else {
				Alert("", "Keranjang anda kosong")
			}
		}}>LANJUTKAN</Button>
	</Container>
}

export default Cart