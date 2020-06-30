import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { CheckBox } from 'native-base'
import { FloatingInputLabel, FloatingInputLabelCurrency } from 'src/components/Input/InputComp';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { addProductPriceIn, addProductPriceOut, clearAllNewProduct, addQuantityStock, addMinQtyStock } from 'src/redux/actions/actionsNewProduct';
import Axios from 'axios';
import { HOST_URL } from 'src/config';
import { validNumber, convertNumber, getUserToken } from 'src/utils/authhelper';
import SwitchButton from 'src/components/Button/SwitchButton';
import { getProduct, removeAllCart } from 'src/redux/actions/actionsStoreProduct';
import { GlobalHeader } from 'src/components/Header/Header';
import ProgressIndicator from 'src/components/StepIndicator/ProgressIndicator';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { RowChild } from 'src/components/Helper/RowChild';
import { ScrollView } from 'react-native-gesture-handler';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Input } from 'src/components/Input/MDInput';
import { Text } from 'src/components/Text/CustomText';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { SizeList } from 'src/styles/size';
import Divider from 'src/components/Row/Divider';

const width = Dimensions.get('window').width

const NewProductLast = ({ navigation }) => {
	const dispatch = useDispatch()
	const NewProduct = useSelector(state => state.NewProduct)
	const User = useSelector(state => state.User)


	const [modalVisible, setModalVisible] = useState(false)
	const [manageStock, setManageStock] = useState(false)
	const [sendNotif, setSendNotif] = useState(false)
	const [apiLoading, setApiLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState()
	const [errorAlert, setErrorAlert] = useState(false)
	const _handlePressNext = async () => {
		if (!NewProduct.price_in) {
			setErrorMessage("Harga modal tidak boleh kosong")
			setErrorAlert(true)
		} else if (!NewProduct.price_out) {
			setErrorMessage("Harga jual tidak boleh kosong")
			setErrorAlert(true)
		}
		else {
			setApiLoading(true)
			let intPriceIn = convertNumber(NewProduct.price_in)
			let intPriceOut = convertNumber(NewProduct.price_out)
			if (NewProduct.price_in == "" || NewProduct.price_out == "") {
				setErrorMessage("Harap isi harga beli dan jual")
				setApiLoading(false)
				setErrorAlert(true)
			} else if ((intPriceOut - intPriceIn) < 0) {
				setErrorMessage("Harga jual harus melebihi harga modal")
				setApiLoading(false)
				setErrorAlert(true)
			} else {
				const formData = new FormData()
				await formData.append('barcode', NewProduct.barcode)
				await formData.append('name', NewProduct.name)
				await formData.append('price_in', intPriceIn)
				await formData.append('price_out', intPriceOut)
				await formData.append('id_category', NewProduct.id_category)
				await formData.append('id_store', User.store.id_store)
				await formData.append('manage_stock', manageStock ? 1 : 0)
				if (manageStock == 1) {
					await formData.append('qty_stock', NewProduct.qty_stock)
					await formData.append('qty_min_stock', NewProduct.qty_min_stock)
					await formData.append('send_notification_stock', sendNotif ? 1 : 1)
					// Send notif 0 for false value
				}
				await formData.append('photo_product', NewProduct.image != "" ? {
					uri: NewProduct.image,
					type: "image/jpeg",
					name: `${Date.now()}.jpeg`
				} : null)
				try {
					const userToken = await getUserToken()
					const response = await Axios.post(`${HOST_URL}/product`, formData,
						{
							headers: { "authorization": userToken }
						})
					setApiLoading(false)
					setModalVisible(true)
					setTimeout(() => {
						setModalVisible(false)
						dispatch(clearAllNewProduct())
						dispatch(removeAllCart())
						dispatch(getProduct(User.store.id_store, userToken))
						if (NewProduct.fromManajemen) {
							navigation.navigate(NewProduct.fromManajemen.back)
						} else {
							navigation.navigate('/cashier')
						}
					}, 1000)
				}
				catch (error) {
					setApiLoading(false)
					setErrorMessage(error.response.data.data.errors.msg)
					setErrorAlert(true)
				}
			}
		}
	}

	const _handleChangeToggle = () => {
		setManageStock(!manageStock)
	}

	const _handleChangePriceIn = (value) => {
		dispatch(addProductPriceIn(value))
	}
	const _handleChangePriceOut = (value) => {
		dispatch(addProductPriceOut(value))
	}
	const _handleChangeStock = (value) => {
		const a = validNumber(value)
		if (a) {
			dispatch(addQuantityStock(value))
		}
	}
	const _handleChangeMinStock = (value) => {
		const a = validNumber(value)
		if (a) {
			dispatch(addMinQtyStock(value))
		}
	}
	return <Container>
		<AwanPopup.Loading visible={apiLoading} />
		<AwanPopup.Alert
			message={errorMessage}
			visible={errorAlert}
			closeAlert={() => setErrorAlert(false)}
		/>
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(!modalVisible);
			}}
		>
			<ModalContent
				image={require('src/assets/images/addproductsuccess.png')}
				infoText="Anda berhasil menambahkan produk"
			/>
		</Modal>
		<GlobalHeader
			title="TAMBAH PRODUK"
			onPressBack={() => navigation.goBack()}
			renderRightAccessory={() => <Wrapper style={{ width: 30 }} spaceBetween>
				{[3, '/', 3].map(v => <Text color="primary" size={16}>{v}</Text>)}
			</Wrapper>}
		/>
		<Body>
			<Text>Masukkan harga modal dan harga jual produk</Text>
			<Wrapper style={{ marginVertical: SizeList.base }} spaceBetween>
				<Input
					_flex currency
					label="Harga modal"
					value={NewProduct.price_in}
					onChangeText={_handleChangePriceIn}
				/>
				<Divider size={SizeList.base} color={ColorsList.transparent} />
				<Input
					_flex currency
					label="Harga jual"
					value={NewProduct.price_out}
					onChangeText={_handleChangePriceOut}
				/>
			</Wrapper>
			<Wrapper spaceBetween>
				<Text>Kelola stok produk</Text>
				<SwitchButton
					handleChangeToggle={_handleChangeToggle}
					toggleValue={manageStock}
				/>
			</Wrapper>
			{manageStock && <View>
				<Wrapper style={{ marginVertical: SizeList.base }} spaceBetween>
					<Input
						_flex
						label="Jumlah stok"
						keyboardType="number-pad"
						value={NewProduct.qty_stock}
						onChangeText={_handleChangeStock}
					/>
					<Divider size={SizeList.base} color={ColorsList.transparent} />
					<Input
						_flex
						label="Minimum Stok"
						keyboardType="number-pad"
						value={NewProduct.qty_min_stock}
						onChangeText={_handleChangeMinStock}
					/>
				</Wrapper>
				<View style={{ ...RowChild, marginBottom: 20, }}>
					{/* <CheckBox
						checked={sendNotif}
						color={sendNotif ? ColorsList.primary : ColorsList.greyFont}
						onPress={() => setSendNotif(!sendNotif)}
					/> */}
					<Button textProps={{ align: "left", font: "Regular" }} color="info" style={{ borderRadius: SizeList.borderRadius }}>
						Jika stok produk sudah mencapai minimum stok akan ada notifikasi di list produk
						{/* <Text style={[{ color: manageStock ? sendNotif ? ColorsList.primary : ColorsList.greyFont : ColorsList.greyFont }, styles.notifInfo]}>Jika stok produk sudah mencapai minimum stok akan diberikan notifikasi</Text> */}
					</Button>
				</View>
			</View>}
		</Body>
		<Footer>
			<Button onPress={_handlePressNext}>SIMPAN</Button>
		</Footer>
	</Container>
}

export default NewProductLast

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
		paddingVertical: 15,
		flexDirection: 'row',
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
		bottom: 5,
		alignSelf: "center"
	},
	notifInfo: {
		// ...FontList.subtitleFont,
		marginLeft: 15
	},
	groupingStyle: {
		backgroundColor: 'white',
		borderRadius: 10,
		marginTop: 30,
		borderWidth: 2,
		borderColor: ColorsList.light
	}
})

