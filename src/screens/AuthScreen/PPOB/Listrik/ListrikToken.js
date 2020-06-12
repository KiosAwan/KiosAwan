import React, { useState, useEffect } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import MDInput, { Input } from 'src/components/Input/MDInput';
import { Bottom, BottomVertical } from 'src/components/View/Bottom';
import { checkListrikToken, payTokenListrik, getProductToken } from 'src/utils/api/ppob/listrik_api';
import { ColorsList } from 'src/styles/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import GlobalEnterPin from '../../GlobalEnterPin';
import { verifyUserPIN, convertRupiah, getUserToken } from 'src/utils/authhelper';
import { Toast } from 'native-base';
import { getProfile } from 'src/redux/actions/actionsUserData';
import SwitchButton from 'src/components/Button/SwitchButton';
import { SizeList } from 'src/styles/size';

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

	// PIN Modal state 
	const [pinVisible, setPinVisible] = useState(false)

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
	useEffect(() => {

	}, [])
	const _getProduct = async () => {
		const res = await getProductToken()
		// console.debug(res)
		setProduct(res.data)
	}
	const _cekTagihan = async (idPel) => {
		setLoading(true)
		const data = {
			productID: 100302,
			customerID: idPel
		}
		// Checking the customer ID to server
		const res = await checkListrikToken(data)
		console.debug(res)
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
				setPinVisible(true)
			}
		} else {
			setAlertMessage("Harap masukkan nomer pelanggan yang benar")
			setAlert(true)
		}
	}

	// Check user pin 
	const _userAuthentication = async (pin) => {
		const data = {
			pin,
			phone_number: User.data.phone_number
		}
		const res = await verifyUserPIN(data)
		if (res.status == 200) {
			setPinVisible(false)
			_processPayment()
		}
		else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		}
	}

	const _processPayment = async () => {
		setPayLoading(true)
		const data = {
			customerID: response.transaction.customerID,
			productID: response.transaction.productID,
			amount: selected.price,
			id_multi: Product.id_multi,
			favorite: favorit ? 1 : 0
		}
		const res = await payTokenListrik(data)
		setPayLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			const data = { type: "token", customerID: res.data.transaction.customerID, price: parseInt(res.data.transaction.total), productName: selected.product }
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
			{/* Modal for check user pin */}
			<GlobalEnterPin
				title="Masukkan PIN"
				codeLength={4}
				subtitle="Masukkan PIN untuk melanjutkan transaksi"
				visible={pinVisible}
				visibleToggle={setPinVisible}
				pinResolve={(pin) => _userAuthentication(pin)} />
			{/* Modal for check user pin */}
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
					setCustId('32127971177')
					_cekTagihan('32127971177')
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
					<Text size={16} font="SemiBold" color="informationFont">{productToken.info.title}</Text>
					{productToken.info.info.rMap((item, i) => (
						<Text key={i} color="informationFont">{`${productToken.info.info.length == 1 ? "" : `${i + 1}. `}${item}`}</Text>
					))}
				</View>
			}
			{response && productToken &&
				<View style={{ flex: 1, padding: SizeList.padding, backgroundColor: "white", borderWidth: SizeList.borderWidth, borderRadius: SizeList.borderRadius, borderColor : ColorsList.borderColor }}>
					<Text style={{ marginBottom: 5 }}>Pilih nominal token listrik</Text>
			<FlatList style={styles.listPulsa} keyExtractor={(a, i) => i.toString()}
				showsVerticalScrollIndicator={false}
				data={productToken ? productToken.product : []}
				renderItem={({ item, index }) =>
					<TouchableOpacity onPress={() => _selectPulsa({ item, index })}>
						<Wrapper spaceBetween style={[styles.pulsaWrapper, item == selected && styles.pulsaWrapperActive]}>
							<View _width="70%">
								<Text font="SemiBold" style={{ marginLeft: 5 }}>{`TOKEN ${item.product.split(" ")[2]}`} </Text>
							</View>
							<View _width="30%">
								<Text size={8}>HARGA</Text>
								<Text font="SemiBold" color="primary">{convertRupiah(item.price)}</Text>
							</View>
						</Wrapper>
					</TouchableOpacity>
				}
			/>
				</View>
			}
		</Body>
		<Footer>
			{response &&
				<Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
					BAYAR
            </Button>
			}
		</Footer>
	</Container >
}
export default ListrikToken