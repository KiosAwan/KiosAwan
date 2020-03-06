import React, { useState } from 'react';
import Container, { Body } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, ActivityIndicator } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import MDInput from 'src/components/Input/MDInput';
import { Bottom, BottomVertical } from 'src/components/View/Bottom';
import { checkTagihanListrik, payTagihanListrik } from 'src/utils/api/ppob/listrik_api';
import { convertRupiah, verifyUserPIN } from 'src/utils/authhelper';
import SwitchButton from 'src/components/Button/SwitchButton';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import GlobalEnterPin from '../../GlobalEnterPin';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const ListrikPrabayar = ({ navigation }) => {
	const dispatch = useDispatch()
	//Reducer for product data
	const Product = useSelector(state => state.Product)
	//User data
	const User = useSelector(state => state.User)
	const [custId, setCustId] = useState(112000026979)
	const [selected, setSelected] = useState()
	//Data tagihan
	const [tagihanLoading, setTagihanLoading] = useState(false)
	const [tagihanData, setTagihanData] = useState()
	const [modal, setModal] = useState(false)

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	//PIN Modal state 
	const [pinVisible, setPinVisible] = useState(false)

	//Loading pay state
	const [payLoading, setPayLoading] = useState(false)

	//Function for check tagihan
	const _cekTagihan = async () => {
		setTagihanLoading(true)
		const data = {
			productID: 100301,
			customerID: custId
		}
		const res = await checkTagihanListrik(data)
		setTagihanLoading(false)
		if (res.status == 400) {
			alert(res.data.errors.msg)
		} else {
			setTagihanData(res.data)
		}
	}

	//Set pin modal visible when user clicked pay button
	const _onPressBayar = () => {
		if (tagihanData) {
			setPinVisible(true)
		} else {
			setAlertMessage("Harap cek tagihan terlebih dahulu")
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
		console.debug(Product.id_multi)
		const data = {
			customerID: tagihanData.transaction.customerID,
			productID: tagihanData.transaction.productID,
			id_multi: Product.id_multi
		}
		const res = await payTagihanListrik(data)
		setPayLoading(false)
		if (res.status == 200) {
			const data = { type: "tagihan_listrik", customerID: res.data.transaction.customerID, price: parseInt(res.data.transaction.total), productName: "Listrik Prabayar" }
			dispatch(AddPPOBToCart(data))
			dispatch(SetIdMultiCart(res.data.transaction.id_multi_transaction))
			console.debug("BERHASIL BAYAR PRABAYAR")
			navigation.goBack()
			// navigation.navigate("Status", {params : res.data})
		} else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg.trim())
			setAlert(true)
		} else {
			console.debug(res)
		}
	}
	return <Container header={{
		title: "Listrik Prabayar",
		// image: require('src/assets/icons/phonebook.png'),
		// onPressIcon: () => setModal(true),
		onPressBack: () => navigation.goBack(),
	}}>
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
			<MDInput _width="80%"
				label="ID Pelanggan"
				value={custId}
				onChangeText={text => setCustId(text)}
			/>
		</View>
		{/* <View style={styles.simpan}>
			<Text>Simpan VA ini untuk masuk ke favorit</Text>
			<SwitchButton
				// handleChangeToggle={_handleChangeToggle}
				toggleValue={true}
			/>
		</View> */}
		{tagihanLoading ? <ActivityIndicator color={ColorsList.primary} />
			:
			tagihanData ?
				<Body style={{ padding: 0, marginBottom: 120 }}>
					<View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Nama Pelanggan</Text>
							<Text font="Regular">{tagihanData.transaction.nama}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Id Pelanggan</Text>
							<Text font="Regular">{tagihanData.transaction.customerID}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Jumlah Tagihan</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.tagihan)}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Denda</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.denda)}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Admin</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.admin)}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Total Tagihan</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.total)}</Text>
						</Wrapper>
					</View>
				</Body>
				: null}
		<BottomVertical>
			<Button onPress={_cekTagihan} color="white" width="100%">
				CEK TAGIHAN
            </Button>
			<Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
				BAYAR
            </Button>
		</BottomVertical>
	</Container >
}
export default ListrikPrabayar