import React, { useState, useEffect } from "react"
import Container, { Body, Footer } from "src/components/View/Container"
import { Wrapper } from "src/components/View/Wrapper"
import styles from "./TelkomStyle"
import { GlobalHeader } from "src/components/Header/Header"
import { Text } from "src/components/Text/CustomText"
import Divider from "src/components/Row/Divider"
import { Button } from "src/components/Button/Button"
import {
	View,
	TouchableOpacity,
	TextInput,
	ScrollView,
	ActivityIndicator,
} from "react-native"
import { $Padding, $Margin } from "src/utils/stylehelper"
import { ColorsList } from "src/styles/colors"
import { Image } from "src/components/CustomImage"
import MDInput, { Input } from "src/components/Input/MDInput"
import Icon from "react-native-vector-icons/FontAwesome5"
import { AwanPopup, Modal } from "src/components/ModalContent/Popups"
import { SizeList } from "src/styles/size"
import { SelectBoxModal } from "src/components/Picker/SelectBoxModal"
import {} from "src/components/Input/InputComp"
import {
	convertRupiah,
	verifyUserPIN,
	getUserToken,
	prettyConsole,
} from "src/utils/authhelper"
import { useDispatch, useSelector } from "react-redux"
import { AddPPOBToCart, SetIdMultiCart } from "src/redux/actions/actionsPPOB"
import SearchInput from "src/components/Input/SearchInput"
import SwitchButton from "src/components/Button/SwitchButton"
import { getProfile } from "src/redux/actions/actionsUserData"
import { openPin } from "src/utils/pin-otp-helper"
import {
	getProductPPOBGeneral,
	inquiryPPOBProduct,
	paymentPPOBProduct,
} from "src/utils/api/ppobapi"
import { PPOB_PRODUCT_CODE } from "src/config/constant"

const Telkom = ({ navigation }) => {
	const dispatch = useDispatch()
	//Reducer for product data
	const Product = useSelector(state => state.Product)
	//User data
	const User = useSelector(state => state.User)
	const [flexStart] = [true]
	const [modal, setModal] = useState(false)
	const [idPelanggan, setIdPelanggan] = useState("")
	// 0361701079
	const [search, setSearch] = useState("")
	const [selected, setSelected] = useState({})
	//Favorite transaction
	const [favorit, setFavorit] = useState()
	//PDAM Product data list state
	const [productData, setProductData] = useState([])

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	//Tagihan state
	const [tagihanLoading, setTagihanLoading] = useState(false)
	const [tagihanData, setTagihanData] = useState()

	//PIN Modal state
	const [pinVisible, setPinVisible] = useState(false)

	//Loading pay state
	const [payLoading, setPayLoading] = useState(false)
	useEffect(() => {
		_setFavoritData()
		_getProductList()
	}, [])

	const _setFavoritData = async () => {
		if (navigation.state.params) {
			const { customerID, name, code } = navigation.state.params
			setIdPelanggan(customerID)
			setSelected({ product_name: name, product_id: code })
			_cekTagihan({ product_name: name, product_id: code }, customerID)
		}
	}
	//Function for getting pdam product list
	const _getProductList = async () => {
		const res = await getProductPPOBGeneral("telco")
		setProductData(res.data)
	}

	//Function when user clicked check tagihan button
	const _cekTagihan = async (prod, idPelanggan) => {
		if (!prod) {
			alert("Harap pilih product!")
		} else {
			setTagihanData()
			setTagihanLoading(true)
			const data = {
				productID: prod.product_id,
				customerID: idPelanggan,
			}
			const res = await inquiryPPOBProduct(data)
			setTagihanLoading(false)
			if (res.status == 400) {
				setAlertMessage(res.data.errors.msg)
				setAlert(true)
			} else {
				setTagihanData(res.data)
			}
		}
	}

	//Set pin modal visible when user clicked pay button

	const _onPressBayar = () => {
		if (tagihanData) {
			openPin(navigation, (pin, close) => {
				setPayLoading(true)
				_userAuthentication(pin, close, selected)
			})
		} else {
			setAlertMessage("Harap cek tagihan terlebih dahulu")
			setAlert(true)
		}
	}

	//Check user pin
	const _userAuthentication = async (pin, closePin, selected) => {
		const data = {
			pin,
			phone_number: User.data.phone_number,
		}
		const res = await verifyUserPIN(data)
		if (res.status == 200) {
			closePin()
			_processPayment(selected)
		} else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		}
	}

	const _processPayment = async selected => {
		setPayLoading(true)
		const data = {
			customerID: tagihanData.transaction.customerID,
			productID: selected.product_id,
			id_multi: Product.id_multi,
			favorite: favorit ? 1 : 0,
		}
		const res = await paymentPPOBProduct(data)
		setPayLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			prettyConsole(res.data)
			const data = {
				type: "Telco Pascabayar",
				customerID: res.data.payment
					? res.data.payment.customerID
					: res.data.data.customerID,
				price: parseInt(res.data.transaction.total),
				productName: selected.product_name,
			}
			dispatch(AddPPOBToCart(data))
			dispatch(getProfile(User.data.id, userToken))
			dispatch(SetIdMultiCart(res.data.transaction.id_multi_transaction))
			navigation.navigate("/ppob/status", { params: res.data })
		} else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg.trim())
			setAlert(true)
		} else {
			console.debug(res)
		}
	}
	const _handleChangeToggle = async () => {
		setFavorit(!favorit)
	}
	return (
		<Container
			header={{
				title: "Telco",
				onPressBack: () => navigation.goBack(),
			}}>
			<Body>
				{/* Popup components */}
				<AwanPopup.Alert
					message={alertMessage}
					visible={alert}
					closeAlert={() => setAlert(false)}
				/>
				<AwanPopup.Loading visible={payLoading} />
				<Modal backdropDismiss={() => setModal(false)} visible={modal}>
					<View>
						<Text size={17} align="center">
							Nomor Pelanggan
						</Text>
						<SearchInput
							textInput={{
								placeholder: "Cari nomor",
							}}
						/>
						<ScrollView
							persistentScrollbar
							style={{ maxHeight: 250, marginTop: 10 }}>
							{[1, 2, 3, 4, 5, 6].rMap((item, i) => [
								<Button color="link">
									Albert Stanley - 123456789123456789
								</Button>,
								i != 5 && <Divider />,
							])}
						</ScrollView>
					</View>
				</Modal>
				<View style={styles.topComp}>
					<SelectBoxModal
						btnStyle={{ marginVertical: SizeList.base }}
						label="Pilih Produk"
						closeOnSelect
						data={
							productData
								? productData.filter(item =>
										item.product_name
											.toLowerCase()
											.includes(search.toLowerCase()),
								  )
								: []
						}
						header={
							<MDInput
								label="Cari Produk"
								renderLeftAccessory={() => (
									<Icon
										style={{ color: ColorsList.primary, marginRight: 10 }}
										size={20}
										name="search"
									/>
								)}
								value={search}
								onChangeText={text => setSearch(text)}
							/>
						}
						value={selected ? selected.product_name : ""}
						handleChangePicker={item => setSelected(item)}
						renderItem={item => (
							<Text
								font="SemiBold"
								color={selected.product_id == item.product_id && "primary"}>
								{item.product_name.toUpperCase()}
							</Text>
						)}>
						<Text>Data tidak ditemukan</Text>
					</SelectBoxModal>
					<Input
						_width="80%"
						label="No Pelanggan"
						value={idPelanggan.toString()}
						onChangeText={text => setIdPelanggan(text)}
						keyboardType="number-pad"
						renderRightAccessory={() => (
							<Button
								onPress={() => _cekTagihan(selected, idPelanggan)}
								color="white"
								noBorder>
								CEK TAGIHAN
							</Button>
						)}
					/>
				</View>
				<View style={styles.simpan}>
					<Text>Simpan ke favorit</Text>
					<SwitchButton
						handleChangeToggle={_handleChangeToggle}
						toggleValue={favorit}
					/>
				</View>
				{tagihanLoading ? (
					<ActivityIndicator color={ColorsList.primary} />
				) : tagihanData ? (
					<View
						style={{
							borderWidth: SizeList.borderWidth,
							borderColor: ColorsList.borderColor,
							padding: SizeList.secondary,
							marginBottom: SizeList.base,
							borderRadius: 5,
							backgroundColor: ColorsList.whiteColor,
						}}>
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Nama Pelanggan</Text>
							<Text font="SemiBold">{tagihanData.transaction.nama}</Text>
						</Wrapper>
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Id Pelanggan</Text>
							<Text font="SemiBold">{tagihanData.transaction.customerID}</Text>
						</Wrapper>
						{selected.product_id == PPOB_PRODUCT_CODE.TELKOM_GROUP ? (
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Jumlah Tagihan</Text>
								<Text font="SemiBold">
									{convertRupiah(tagihanData.transaction.tagihan1)}
								</Text>
							</Wrapper>
						) : (
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Jumlah Tagihan</Text>
								<Text font="SemiBold">
									{convertRupiah(tagihanData.transaction.tagihan)}
								</Text>
							</Wrapper>
						)}
						{selected.product_id == PPOB_PRODUCT_CODE.TELKOM_GROUP && (
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Jumlah Tagihan 2</Text>
								<Text font="SemiBold">
									{convertRupiah(tagihanData.transaction.tagihan2)}
								</Text>
							</Wrapper>
						)}
						{selected.product_id == PPOB_PRODUCT_CODE.TELKOM_GROUP && (
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Jumlah Tagihan 3</Text>
								<Text font="SemiBold">
									{convertRupiah(tagihanData.transaction.tagihan3)}
								</Text>
							</Wrapper>
						)}
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Denda</Text>
							<Text font="SemiBold">
								{convertRupiah(tagihanData.transaction.denda)}
							</Text>
						</Wrapper>
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Admin</Text>
							<Text font="SemiBold">
								{convertRupiah(tagihanData.transaction.admin)}
							</Text>
						</Wrapper>
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Total Tagihan</Text>
							<Text font="SemiBold">
								{convertRupiah(tagihanData.transaction.total)}
							</Text>
						</Wrapper>
					</View>
				) : null}
				{tagihanData && tagihanData.info && (
					<View style={styles.infoPembelian}>
						<Text size={16} color="informationFont">
							{tagihanData.info.title}
						</Text>
						{tagihanData.info.info.rMap((item, i) => (
							<Text key={i} color="informationFont">{`${
								tagihanData.info.info.length == 1 ? "" : `${i + 1}. `
							}${item}`}</Text>
						))}
					</View>
				)}
				{tagihanData ? (
					<Button
						flexStart
						style={$Margin(0, 0, 10)}
						noRadius
						style={{ borderRadius: SizeList.borderRadius }}
						color={["cashbackBg", "cashbackFont"]}
						disabled>
						<View>
							<Text color="cashbackFont" size={16}>
								Cashback
							</Text>
							<Text color="cashbackFont">
								{`Cashback yang didapat oleh mitra sebesar ${convertRupiah(
									parseInt(tagihanData.transaction.cashback),
								)}`}
							</Text>
						</View>
					</Button>
				) : null}
			</Body>
			<Footer>
				{tagihanData && (
					<Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
						BAYAR
					</Button>
				)}
			</Footer>
		</Container>
	)
}
export default Telkom
