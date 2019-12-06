import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { convertRupiah, validNumber } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { ProductCard } from '../../components/Card/CardComp';
import { AddCart, MinusQuantity, AddQuantity, AddDiscountName, AddDiscountRupiah, AddDiscountPersen, AddNotesTransaction } from '../../redux/actions/actionsStoreProduct';
import { RegisterButton, BottomButton } from '../../components/Button/ButtonComp';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { GlobalHeader } from '../../components/Header/Header';
import { WrapperItem, PilihPelanggan, PopupDetailPesanan, ToggleButton } from '../../components/Picker/SelectBoxModal';
import { Icon, Item, CheckBox } from 'native-base';
import { FloatingInputLabel } from '../../components/Input/InputComp';
import { FontList } from '../../styles/typography';
import { RowChild } from '../../components/Helper/RowChild';
import SwitchButton from '../../components/Button/SwitchButton';
import { SizeList } from '../../styles/size';
const height = Dimensions.get('window').height
const Cart = ({ navigation }) => {
	const dispatch = useDispatch()
	const Product = useSelector(state => state.Product)
	const User = useSelector(state => state.User)
	const Customer = useSelector(state => state.Customer)
	const [pilihPelangganOpen, setPilihPelangganOpen] = useState(false)
	const [editPesananOpen, setEditPesananOpen] = useState(false)
	const [diskon, setDiskon] = useState(false)
	const [activeIndex, setActiveIndex] = useState(0)
	const listbuttons = ["RP", "%"]
	const _handleNextBtn = async () => {
		await dispatch(getCustomer(User.store.id_store))
		navigation.navigate('CheckOut')
	}
	const _editPesanan = (index, pesanan) => {
		console.log(index, pesanan)
		setEditPesananOpen(true);
	}

	const _handleChangeToggle = () => {
		setDiskon(!diskon)
	}

	const _handleChangeBtn = (btn, i) => {
		setActiveIndex(i)
	}

	const _handleChangeDiskonInput = (text) => {
		if (validNumber(text)) {
			if (activeIndex == 0) {
				if(text <= Product.total)
				dispatch(AddDiscountRupiah(text))
			}
			else {
				if(text.length <= 3 && text <= 100 || text == ""){
				dispatch(AddDiscountPersen(text))}
				else {
					alert("Tidak boleh diatas 100%")
				}
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
				<PopupDetailPesanan visible={editPesananOpen} dismiss={() => setEditPesananOpen(false)} />
				<View style={{ padding: 15 }}>
					<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
						{
							Product.belanja.map((data, i) => {
								return (
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
										<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.name_product}</Text>,
										<Text style={{ color: ColorsList.greyFont }}>Rp. {data.price_out_product} x {data.quantity}</Text>
									]} right={[
										<Icon onPress={() => _editPesanan(i, data)} style={{ color: ColorsList.primaryColor }} name="create" />,
										<Text style={{ color: ColorsList.greyFont }}>Rp. {data.price_out_product * data.quantity}</Text>
									]} />
								)
							})
						}
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
							<Text style={{ ...FontList.subtitleFontGreyBold }}>Subtotal</Text>,
						]} right={
							<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(Product.total)}</Text>
						} />
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
							<Text style={{ ...FontList.subtitleFontGreyBold }}>Total</Text>,
						]} right={
							<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(Product.total - Product.total_diskon)}</Text>
						} />
					</View>
					<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15, }} left={[
							<Item style={{ borderColor: 'transparent', alignItems: "center" }}>
								<Icon style={{ color: ColorsList.primaryColor }} name="contact" />
								<Text style={{ ...FontList.subtitleFontGreyBold }}>{Product.customer ? Product.customer.name_customer : "Pilih pelanggan"}</Text>
							</Item>
						]} right={
							<Icon onPress={() => setPilihPelangganOpen(true)} style={{ color: ColorsList.primaryColor }} name="add" />
						} />
					</View>
					<View style={styles.groupingStyle}>
						<View style={styles.wrapSwitchAndText}>
							<Text style={{ ...FontList.titleFont, color: ColorsList.greyFont }}>Kelola stok produk</Text>
							<SwitchButton
								handleChangeToggle={_handleChangeToggle}
								toggleValue={diskon}
							/>
						</View>
						{diskon ?
							<View>
								<View style={{ height: 1, backgroundColor: "#e0dada" }} />
								<View style={styles.wrapInputHarga}>
									<View style={{ marginTop: 10 }}>
										<FloatingInputLabel
											label="Nama diskon"
											value={Product.discount_name}
											handleChangeText={text => dispatch(AddDiscountName(text))}
										/>
									</View>
									<View style={{ marginTop: 10, ...RowChild }}>
										<View>
											<TextInput
												placeholder="Jumlah diskon"
												style={{ borderBottomWidth: 0.5, width: SizeList.width * 0.65, color: ColorsList.greyFont, fontSize: 18 }}
												keyboardType="numeric"
												value={activeIndex == 0 ? Product.discount_total_rupiah.toString() : Product.discount_total_persen != null ? Product.discount_total_persen.toString() : ''} 
												onChangeText={_handleChangeDiskonInput}
											/>
										</View>
										<View style={{}}>
											{<Item style={{ width: '100%' }}>
												{
													listbuttons.map((btn, i) => {
														return (
															<TouchableOpacity key={i} onPress={() => _handleChangeBtn(btn, i)} style={[
																{ width: SizeList.width * 0.1, padding: 5, flex: 1, alignItems: 'center' },
																{ backgroundColor: activeIndex == i ? ColorsList.primaryColor : ColorsList.greyFont },
															]}>
																<Text style={
																	{ fontSize: 18, color: activeIndex == i ? 'white' : 'black' }
																}>{btn}</Text>
															</TouchableOpacity>
														)
													})
												}
											</Item>}
										</View>
									</View>
								</View>
							</View>
							: null}

					</View>
					<View style={[{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }, { padding: 10, paddingHorizontal: 15 }]}>
						<FloatingInputLabel
						handleChangeText={text => dispatch(AddNotesTransaction(text))}
						value={Product.catatan_pembelian}
						label="Catatan Pembelian" placeholder="Masukkan catatan pembelian disini" />
					</View>
				</View>
			</ScrollView>
			<View style={styles.absoluteButton}>
				<BottomButton
					onPressBtn={() => {
						navigation.navigate('CheckOut')
						dispatch(getCustomer(User.store.id_store))
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