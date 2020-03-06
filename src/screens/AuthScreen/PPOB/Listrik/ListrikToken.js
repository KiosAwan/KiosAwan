import React, { useState, useEffect } from 'react';
import Container from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import MDInput from 'src/components/Input/MDInput';
import { Bottom, BottomVertical } from 'src/components/View/Bottom';
import { checkListrikToken, payTokenListrik, getProductToken } from 'src/utils/api/ppob/listrik_api';
import { ColorsList } from 'src/styles/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import GlobalEnterPin from '../../GlobalEnterPin';
import { verifyUserPIN, convertRupiah } from 'src/utils/authhelper';
import { Toast } from 'native-base';

const ListrikToken = ({ navigation }) => {
	const dispatch = useDispatch()
	//Reducer for product data
	const Product = useSelector(state => state.Product)
	//User data
	const User = useSelector(state => state.User)
	const [custId, setCustId] = useState()
	const [selected, setSelected] = useState()

	//Loading state
	const [loading, setLoading] = useState(false)
	//Response after checking tagihan
	const [response, setResponse] = useState()
	const [productToken, setProduct] = useState()
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	//PIN Modal state 
	const [pinVisible, setPinVisible] = useState(false)

	//Loading pay state
	const [payLoading, setPayLoading] = useState(false)
	const _selectPulsa = ({ item, index }) => {
		setSelected(item)
	}

	useEffect(() => {
		_getProduct()
	}, [])

	const _getProduct = async () => {
		const res = await getProductToken()
		setProduct(res.data)
	}
	const _cekTagihan = async (idPel) => {
		setLoading(true)
		const data = {
			productID: 100302,
			customerID: idPel
		}
		//Checking the customer ID to server
		const res = await checkListrikToken(data)
		setLoading(false)
		setSelected()
		//Set the response data to state
		if (res.status == 200) {
			setResponse(res.data)
		} else {
			setResponse([])
		}
	}

	//Set pin modal visible when user clicked pay button
	const _onPressBayar = () => {
		if (response) {
			if (!selected) {
				setAlertMessage("Harap pilih product")
				setAlert(true)
			} else {
				setPinVisible(true)
			}
		} else {
			setAlertMessage("Harap masukkan nomer pelanggan yang benar")
			setAlert(true)
		}
	}

	//Check user pin 
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
			id_multi: Product.id_multi
		}
		const res = await payTokenListrik(data)
		setPayLoading(false)
		if (res.status == 200) {
			const data = { type: "token", customerID: res.data.transaction.customerID, price: parseInt(res.data.transaction.total), productName: selected.product }
			dispatch(AddPPOBToCart(data))
			dispatch(SetIdMultiCart(res.data.transaction.id_multi_transaction))
			console.debug("BERHASIL TOKEN")
			navigation.goBack()
			// navigation.navigate("Status", {params : res.data})
		} else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg.trim())
			setAlert(true)
		} else {
			console.debug(res)
		}
	}
	return <Container>
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
		<GlobalHeader onPressBack={() => navigation.goBack()} title="Token" />
		<View style={styles.topComp}>
			<MDInput _width="80%"
				label="ID Pelanggan"
				value={custId ? custId.toString() : null}
				onChangeText={text => {
					setCustId(text)
					_cekTagihan(text)
				}}
				keyboardType="number-pad"
			/>
			<Text>32127971177</Text>
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
		<FlatList style={styles.listPulsa} numColumns={2} keyExtractor={(a, i) => i.toString()}
			showsVerticalScrollIndicator={false}
			data={productToken ? productToken : []}
			renderItem={({ item, index }) =>
				<TouchableOpacity onPress={() => {
					if (response && response.length !== 0) {
						_selectPulsa({ item, index })
					} else {
						Toast.show({
							text: "Harap isi nomer pelanggan dengan benar",
							type: "danger"
						})
					}
				}} style={[styles.pulsaWrapper, item === selected && styles.pulsaWrapperActive]}>
					<Text style={styles.pulsaComp}>{item.product.slice(0, 9)}</Text>
					<Text color="primary" size={20} style={styles.pulsaComp}>Rp. {item.product.slice(10, item.length)}</Text>
					<Divider />
					<Text style={styles.pulsaComp}>Harga: {convertRupiah(item.total)}</Text>
				</TouchableOpacity>
			}
		/>
		<Bottom>
			<Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
				BAYAR
            </Button>
		</Bottom>
	</Container>
}
export default ListrikToken