import React, { useState } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, ActivityIndicator } from 'react-native';
import { $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import MDInput from 'src/components/Input/MDInput';
import { checkTagihanListrik, payTagihanListrik } from 'src/utils/api/ppob/listrik_api';
import { convertRupiah, verifyUserPIN } from 'src/utils/authhelper';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import GlobalEnterPin from '../../GlobalEnterPin';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getProfile } from 'src/redux/actions/actionsUserData';
import Alert from 'src/utils/alert';

const ListrikPascabayar = ({ navigation }) => {
	const dispatch = useDispatch()
	//Reducer for product data
	const Product = useSelector(state => state.Product)
	//User data
	const User = useSelector(state => state.User)
	const [custId, setCustId] = useState()
	// 122030204439
	const [] = useState()
	const [selectedCashback, setSelectedCashback] = useState(2500)
	//Data tagihan
	const [tagihanLoading, setTagihanLoading] = useState(false)
	const [tagihanData, setTagihanData] = useState()
	const [] = useState(false)

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	//PIN Modal state 
	const [pinVisible, setPinVisible] = useState(false)

	//Loading pay state
	const [payLoading, setPayLoading] = useState(false)
	//LDetail visibility state
	const [detail, setDetail] = useState(false)

	//Function for check tagihan
	const _cekTagihan = async () => {
		setTagihanLoading(true)
		const params = {
			productID: 100301,
			customerID: custId
		}
		const { status, data } = await checkTagihanListrik(params)
		setTagihanLoading(false)
		if (status == 400) {
			setAlertMessage(data.errors.msg)
			setAlert(true)
		} else {
			setTagihanData(data)
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
		const data = {
			customerID: tagihanData.transaction.customerID,
			productID: tagihanData.transaction.productID,
			id_multi: Product.id_multi,
			selectedCashback
		}
		const res = await payTagihanListrik(data)
		setPayLoading(false)
		if (res.status == 200) {
			console.debug(res.data)
			const data = {
				type: "tagihan_listrik",
				customerID: res.data.transaction.customerID,
				price: parseInt(res.data.transaction.tagihan) +
					(selectedCashback * tagihanData.details.length) +
					parseInt(res.data.transaction.denda)
				,
				productName: "Listrik Pascabayar"
			}
			dispatch(AddPPOBToCart(data))
			dispatch(getProfile(User.data.id))
			dispatch(SetIdMultiCart(res.data.transaction.id_multi_transaction))
			navigation.navigate("/ppob/status", { params: res.data })
		} else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg.trim())
			setAlert(true)
		} else {
			console.debug(res)
		}
	}
	return <Container header={{
		title: "Listrik Pascabayar",
		// image: require('src/assets/icons/phonebook.png'),
		// onPressIcon: () => setModal(true),
		onPressBack: () => navigation.goBack(),
	}}>
		<View>
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
					keyboardType="number-pad"
				/>
			</View>
			{/* <View style={styles.simpan}>
				<Text>Simpan VA ini untuk masuk ke favorit</Text>
				<SwitchButton
					// handleChangeToggle={_handleChangeToggle}
					toggleValue={true}
				/>
			</View> */}
		</View>
		<Body style={{ padding: 0 }}>
			{
				tagihanLoading ?
					<ActivityIndicator color={ColorsList.primary} /> :
					tagihanData && <View>
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
								<Text font="Regular">{convertRupiah(tagihanData.details.length * selectedCashback)}</Text>
							</Wrapper>
							<Divider />
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Total Tagihan</Text>
								<Text font="Regular">{convertRupiah(
									parseInt(tagihanData.transaction.tagihan) +
									(selectedCashback * tagihanData.details.length) +
									parseInt(tagihanData.transaction.denda)
								)}</Text>
							</Wrapper>
						</View>
						<View style={{ ...$Margin(5, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
							<Button color={["transparent", "primary"]}
								align="flex-end"
								onPress={() => setDetail(!detail)}>DETAIL</Button>
							{
								detail && tagihanData.details.map((item, i) =>
									<View key={i}>
										{/* <Wrapper justify="space-between" style={{ paddingHorizontal: 10, paddingVertical: 5 }}> */}
										<Wrapper justify="space-between" style={{ padding: 10 }}>
											<Text font="Regular">Periode</Text>
											<Text font="Regular">{item.periode}</Text>
										</Wrapper>
										<Wrapper justify="space-between" style={{ padding: 10 }}>
											<Text font="Regular">Denda</Text>
											<Text font="Regular">{convertRupiah(item.denda)}</Text>
										</Wrapper>
										<Wrapper justify="space-between" style={{ padding: 10 }}>
											<Text font="Regular">Tagihan</Text>
											<Text font="Regular">{convertRupiah(item.tagihan)}</Text>
										</Wrapper>
										<Wrapper justify="space-between" style={{ padding: 10 }}>
											<Text font="Regular">Admin</Text>
											<Text font="Regular">{convertRupiah(selectedCashback)}</Text>
										</Wrapper>
										{/* </Wrapper> */}
										{i < tagihanData.details.length - 1 ?
											<Divider />
											: null}
									</View>
								)}

						</View>
						{tagihanData &&
							<View>
								<Text align="center">Pilih Biaya Admin</Text>
								<Wrapper style={{ padding: 15 }} justify="space-between">
									{
										tagihanData.cash_back.map((item, i) => {
											const isSelected = item.toString() == selectedCashback.toString()
											return <Button
												disabled={isSelected}
												onPress={() => setSelectedCashback(item)}
												color={['whiteColor', 'primary', isSelected ? 'primary' : 'transparent']}
												_flex _style={{ margin: 2 }} key={i}>{convertRupiah(item)}</Button>
										})
									}
								</Wrapper>
								<Button style={$Margin(0, 15, 15)} textProps={{ size: 13 }} color={['infoBg', 'info']} disabled>
									{`Cashback yang didapat oleh mitra sebesar ${convertRupiah(
										(selectedCashback * tagihanData.details.length) -
										(parseInt(tagihanData.transaction.modal) * tagihanData.details.length)
									)}`}
								</Button>
							</View>
						}
					</View>
			}
		</Body>
		<Footer>
			<Button onPress={_cekTagihan} color="white" width="100%">
				CEK TAGIHAN
            </Button>
			<Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
				BAYAR
            </Button>
		</Footer>
	</Container >
}
export default ListrikPascabayar