import React, { useState, useEffect } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from 'src/components/Input/MDInput';
import { ColorsList } from 'src/styles/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { verifyUserPIN, convertRupiah, getUserToken } from 'src/utils/authhelper';
import { getProfile } from 'src/redux/actions/actionsUserData';
import SwitchButton from 'src/components/Button/SwitchButton';
import { SizeList } from 'src/styles/size';
import { openPin } from 'src/utils/pin-otp-helper';
import { getProductPPOBGeneral, inquiryPPOBProduct, paymentPPOBProduct } from 'src/utils/api/ppobapi';
import { PPOB_PRODUCT_CODE } from 'src/config/constant';

const ListrikToken = ({ navigation }) => {
	const dispatch = useDispatch()
	// Reducer for product data
	const Product = useSelector(state => state.Product)
	// User data
	const User = useSelector(state => state.User)
	const [custId, setCustId] = useState("")
	const [selected, setSelected] = useState()

	// Loading state
	const [loading, setLoading] = useState(false)
	// Response after checking tagihan
	const [response, setResponse] = useState()
	const [productToken, setProduct] = useState()
	//Favorite transaction
	const [favorit, setFavorit] = useState()
	// alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	// Loading pay state
	const [payLoading, setPayLoading] = useState(false)
	const _selectPulsa = ({ item, index }) => {
		setSelected(item)
	}

	useEffect(() => {
		_getProduct()
		if (navigation.state.params) {
			let { customerID } = navigation.state.params
			setCustId(customerID)
			_cekTagihan(customerID)
		}
	}, [])
	
	const _getProduct = async () => {
		const res = await getProductPPOBGeneral("listrik/pln_prepaid")
		setProduct(res.data)
	}
	const _cekTagihan = async (idPel) => {
		setLoading(true)
		const data = {
			productID: PPOB_PRODUCT_CODE.PLN_PREPAID,
			customerID: idPel
		}
		// Checking the customer ID to server
		const res = await inquiryPPOBProduct(data)
		setLoading(false)
		setSelected()
		// Set the response data to state
		if (res.status == 200) {
			setResponse(res.data)
		} else {
			setResponse([])
		}
	}

	// Set pin modal visible when user clicked pay button
	const _onPressBayar = () => {
		if (response) {
			if (!selected) {
				setAlertMessage("Harap pilih produk")
				setAlert(true)
			} else {
				openPin(navigation, (pin, close) => {
					_userAuthentication(pin, close, selected)
				})
			}
		} else {
			setAlertMessage("Harap masukkan nomer pelanggan yang benar")
			setAlert(true)
		}
	}

	// Check user pin 
	const _userAuthentication = async (pin, closePin, selected) => {
		const data = {
			pin,
			phone_number: User.data.phone_number
		}
		const res = await verifyUserPIN(data)
		if (res.status == 200) {
			closePin()
			_processPayment(selected)
		}
		else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		}
	}

	const _processPayment = async (selected) => {
		setPayLoading(true)
		const data = {
			customerID: response.transaction.customerID,
			productID: PPOB_PRODUCT_CODE.PLN_PREPAID,
			nominal: selected.price,
			id_multi: Product.id_multi,
			favorite: favorit ? 1 : 0
		}
		const res = await paymentPPOBProduct(data)
		setPayLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			const data = { type: "token", customerID: res.data.transaction.customerID, price: parseInt(res.data.transaction.total), productName: selected.product_name }
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
	return <Container header={{
		onPressBack: () => navigation.goBack(),
		title: "Listrik Token"
	}}>
		<Body>
			{/* Popup components */}
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<AwanPopup.Loading visible={payLoading} />
			{/* Popup components */}
			<View style={styles.topComp}>
				{__DEV__ && <Button onPress={() => {
					setCustId('777777777777')
					_cekTagihan('777777777777')
				}}>32127971177</Button>}
				<Input
					_width="80%"
					label="ID Pelanggan"
					value={custId.toString()}
					onChangeText={text => {
						setCustId(text)
					}}
					keyboardType="phone-pad"
					renderRightAccessory={() => <Button onPress={() => _cekTagihan(custId)} color="white" noBorder>CEK IDPEL</Button>}
				/>
			</View>
			<View style={styles.simpan}>
				<Text>Simpan nomor ini ke favorit</Text>
				<SwitchButton
					handleChangeToggle={_handleChangeToggle}
					toggleValue={favorit}
				/>
			</View>
			{loading ?
				<View style={styles.custInfo}>
					<ActivityIndicator color={ColorsList.primary} />
				</View>
				:
				response ?
					<View style={styles.custInfo}>
						{response.length == 0 ?
							<Text color="danger">DATA PELANGGAN TIDAK DITEMUKAN</Text>
							:
							<View>
								<Wrapper justify="space-between">
									<Text font="Regular">Nama Pelanggan</Text>
									<Text font="Regular">{response.transaction.nama}</Text>
								</Wrapper>
								<Wrapper justify="space-between">
									<Text font="Regular">Daya Listrik</Text>
									<Text font="Regular">{parseInt(response.transaction.daya)} VA</Text>
								</Wrapper>
							</View>
						}
					</View>
					: null
			}
			{productToken && !response &&
				<View style={styles.infoPembelian}>
					<Text size={16} color="informationFont">{productToken.info.title}</Text>
					{productToken.info.info.rMap((item, i) => (
						<Text key={i} color="informationFont">{`${productToken.info.info.length == 1 ? "" : `${i + 1}. `}${item}`}</Text>
					))}
				</View>
			}
			{response && response.length != 0 && productToken &&
				<View style={{ flex: 1, padding: SizeList.padding, backgroundColor: "white", borderWidth: SizeList.borderWidth, borderRadius: SizeList.borderRadius, borderColor: ColorsList.borderColor }}>
					<Text style={{ marginBottom: 5 }}>Pilih nominal token listrik</Text>
					<FlatList style={styles.listPulsa} keyExtractor={(a, i) => i.toString()}
						showsVerticalScrollIndicator={false}
						data={productToken ? productToken.product : []}
						renderItem={({ item, index }) =>
							<TouchableOpacity onPress={() => _selectPulsa({ item, index })}>
								<Wrapper spaceBetween style={[styles.pulsaWrapper, item == selected && styles.pulsaWrapperActive]}>
									<View _width="60%">
										<Text font="SemiBold" style={{ marginLeft: 5 }}>{`TOKEN ${item.product_name.split(" ")[2]}`} </Text>
									</View>
									<View _width="40%">
										<Text size={8}>HARGA</Text>
										<Text font="SemiBold" color="primary">{convertRupiah(item.total)}</Text>
									</View>
								</Wrapper>
							</TouchableOpacity>
						}
					/>
				</View>
			}
		</Body>
		<Footer>
			{response && response.length != 0 &&
				<Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
					BAYAR
            </Button>
			}
		</Footer>
	</Container >
}
export default ListrikToken