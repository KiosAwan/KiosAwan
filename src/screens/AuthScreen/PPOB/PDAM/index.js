import React, { useState, useEffect } from "react"
import Container, { Body, Footer } from "src/components/View/Container"
import { Wrapper } from "src/components/View/Wrapper"
import styles from "./PDAMStyles"
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
} from "src/utils/authhelper"
import { useDispatch, useSelector } from "react-redux"
import { AddPPOBToCart, SetIdMultiCart } from "src/redux/actions/actionsPPOB"
import SearchInput from "src/components/Input/SearchInput"
import SwitchButton from "src/components/Button/SwitchButton"
import { getProfile } from "src/redux/actions/actionsUserData"
import json from "src/assets/json/ppob_pdam.json"
import { openPin } from "src/utils/pin-otp-helper"
import {
	getProductPPOBGeneral,
	inquiryPPOBProduct,
	paymentPPOBProduct,
} from "src/utils/api/ppobapi"
import { PPOB_PRODUCT_CODE } from "src/config/constant"

const PDAM = ({ navigation }) => {
	const dispatch = useDispatch()
	//Reducer for product data
	const Product = useSelector(state => state.Product)
	//User data
	const User = useSelector(state => state.User)

	const [modal, setModal] = useState(false)
	const [idPelanggan, setIdPelanggan] = useState("")
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
			setSelected({ product_name: name, product_code: code })
			_cekTagihan({ product_name: name, product_code: code }, customerID)
		}
	}
	//Function for getting pdam product list
	const _getProductList = async () => {
		const res = await getProductPPOBGeneral("pdam")
		setProductData(res.data)
	}

	//Function when user clicked check tagihan button
	const _cekTagihan = async (selected, idPelanggan) => {
		if (!selected) {
			alert("Harap pilih PDAM")
		} else {
			setTagihanData()
			setTagihanLoading(true)
			const data = {
				productID: PPOB_PRODUCT_CODE.PDAM,
				customerID: idPelanggan,
				product_code: selected.product_code,
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
		setPayLoading(false)
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
			productID: PPOB_PRODUCT_CODE.PDAM,
			product_code: selected.product_code,
			id_multi: Product.id_multi,
			favorite: favorit ? 1 : 0,
		}
		const res = await paymentPPOBProduct(data)
		setPayLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			const data = {
				type: "pdam",
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
				title: "Pembayaran PDAM",
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
				<View style={styles.topComp}>
					{/* {__DEV__ &&
                    <View style={{ backgroundColor: ColorsList.greyBg, padding: 15 }}>
                        <Text align="center">Dev Purpose Only</Text>
                        <SelectBoxModal style={{ marginTop: 15 }}
                            label="Pilih Lokasi PDAM" closeOnSelect
                            data={json}
                            value={selected ? selected.name : ""}
                            handleChangePicker={(item) => {
                                let {
                                    customerID,
                                    productID: product_code,
                                    PDAM: product_name
                                } = item
                                setSelected({ product_code, product_name })
                                setIdPelanggan(customerID)
                            }}
                            renderItem={(item) => <Text color={idPelanggan == item.customerID && 'primary'}>{item.customerID} - {item.PDAM}</Text>}>
                            <Text>Data tidak ditemukan</Text>
                        </SelectBoxModal>
                    </View>
                } */}
					<SelectBoxModal
						btnStyle={{ marginBottom: SizeList.base }}
						style={{ height: 400 }}
						label="Pilih Lokasi PDAM"
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
								label="Cari Lokasi PDAM"
								renderRightAccessory={() => (
									<Icon
										style={{ color: ColorsList.primary, marginRight: 10 }}
										size={17}
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
								style={{ paddingHorizontal: SizeList.secondary }}
								color={
									selected.product_code == item.product_code
										? "primary"
										: "greyFontHard"
								}>
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
							marginBottom: SizeList.base,
							padding: SizeList.secondary,
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
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Jumlah Tagihan</Text>
							<Text font="SemiBold">
								{convertRupiah(tagihanData.transaction.tagihan)}
							</Text>
						</Wrapper>
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
export default PDAM
