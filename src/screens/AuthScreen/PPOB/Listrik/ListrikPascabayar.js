import React, { useState, useEffect } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, ActivityIndicator } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Input } from 'src/components/Input/MDInput';
import { checkTagihanListrik, payTagihanListrik } from 'src/utils/api/ppob/listrik_api';
import { convertRupiah, verifyUserPIN, getUserToken } from 'src/utils/authhelper';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getProfile } from 'src/redux/actions/actionsUserData';
import SwitchButton from 'src/components/Button/SwitchButton';
import { SizeList } from 'src/styles/size';
import { openPin } from 'src/utils/pin-otp-helper';

const ListrikPascabayar = ({ navigation }) => {
	const dispatch = useDispatch()
	//Reducer for product data
	const Product = useSelector(state => state.Product)
	//User data
	const User = useSelector(state => state.User)
	const [custId, setCustId] = useState('')
	// 520060002607
	const [] = useState()
	const [selectedCashback, setSelectedCashback] = useState(2500)
	//Data tagihan
	const [tagihanLoading, setTagihanLoading] = useState(false)
	const [tagihanData, setTagihanData] = useState()
	const [] = useState(false)
	//Favorite transaction
	const [favorit, setFavorit] = useState()
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
	const _cekTagihan = async (x) => {
		setTagihanLoading(true)
		setTagihanData()
		const params = {
			productID: 100301,
			customerID: x
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
	//Effect
	useEffect(() => {
		if (navigation.state.params) {
			let { customerID } = navigation.state.params
			setCustId(customerID)
			_cekTagihan(customerID)
		}
	}, [])
	//Set pin modal visible when user clicked pay button
	const _onPressBayar = () => {
		if (tagihanData) {
			openPin(navigation, (pin, close) => {
				_userAuthentication(pin, close)
			})
		} else {
			setAlertMessage("Harap cek tagihan terlebih dahulu")
			setAlert(true)
		}
	}

	//Check user pin 
	const _userAuthentication = async (pin, closePin) => {
		const data = {
			pin,
			phone_number: User.data.phone_number
		}
		const res = await verifyUserPIN(data)
		if (res.status == 200) {
			closePin()
			_processPayment()
		} else if (res.status == 400) {
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
			favorite: favorit ? 1 : 0
		}
		const res = await payTagihanListrik(data)
		setPayLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			const data = {
				type: "tagihan_listrik",
				customerID: res.data.transaction.customerID,
				price: parseInt(res.data.transaction.total)
				,
				productName: "Listrik Pascabayar"
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
	return <Container header={{
		title: "Listrik Pascabayar",
		onPressBack: () => navigation.goBack(),
	}}>
		<Body>
			<View>
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
						setCustId('142600857205')
						_cekTagihan('142600857205')
					}}>32127971177</Button>}
					<Input
						_width="80%"
						label="ID Pelanggan"
						value={custId.toString()}
						onChangeText={text => {
							setCustId(text)
						}}
						keyboardType="phone-pad"
						renderRightAccessory={() => <Button onPress={() => _cekTagihan(custId)} color="white" noBorder>CEK TAGIHAN</Button>}
					/>
				</View>
				<View style={styles.simpan}>
					<Text>Simpan nomor ini ke favorit</Text>
					<SwitchButton
						handleChangeToggle={_handleChangeToggle}
						toggleValue={favorit}
					/>
				</View>
			</View>
			{
				tagihanLoading ?
					<ActivityIndicator color={ColorsList.primary} /> :
					tagihanData && <View>
						<View style={{ borderRadius: 5, backgroundColor: ColorsList.whiteColor, borderWidth: SizeList.borderWidth, borderRadius: SizeList.borderRadius, borderColor: ColorsList.borderColor, padding: SizeList.padding }}>
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
								<Text font="SemiBold">{convertRupiah(tagihanData.transaction.tagihan)}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Denda</Text>
								<Text font="SemiBold">{convertRupiah(tagihanData.transaction.denda)}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Admin</Text>
								<Text font="SemiBold">{convertRupiah(tagihanData.transaction.admin)}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Total Tagihan</Text>
								<Text font="SemiBold">{convertRupiah(
									parseInt(tagihanData.transaction.total)
								)}</Text>
							</Wrapper>
							<Button color={["transparent", "primary"]}
								align="flex-end"
								onPress={() => setDetail(!detail)}>DETAIL</Button>
							{
								detail && tagihanData.details.rMap((item, i) =>
									<View key={i}>
										{/* <Wrapper justify="space-between" style={{ paddingHorizontal: 10, paddingVertical: 5 }}> */}
										<Wrapper justify="space-between" style={{ padding: 10, paddingHorizontal: SizeList.padding }}>
											<Text font="Regular">Periode</Text>
											<Text font="SemiBold">{item.periode}</Text>
										</Wrapper>
										<Wrapper justify="space-between" style={{ padding: 10, paddingHorizontal: SizeList.padding }}>
											<Text font="Regular">Denda</Text>
											<Text font="SemiBold">{convertRupiah(item.denda)}</Text>
										</Wrapper>
										<Wrapper justify="space-between" style={{ padding: 10, paddingHorizontal: SizeList.padding }}>
											<Text font="Regular">Tagihan</Text>
											<Text font="SemiBold">{convertRupiah(item.tagihan)}</Text>
										</Wrapper>
										<Wrapper justify="space-between" style={{ padding: 10, paddingHorizontal: SizeList.padding }}>
											<Text font="Regular">Admin</Text>
											<Text font="SemiBold">{convertRupiah(selectedCashback)}</Text>
										</Wrapper>
										{/* </Wrapper> */}
										{i < tagihanData.details.length - 1 ?
											<Divider />
											: null}
									</View>
								)}
						</View>
						{tagihanData &&
							<View style={styles.infoPembelian}>
								<Text size={16} color="informationFont">{tagihanData.info.title}</Text>
								{tagihanData.info.info.rMap((item, i) => (
									<Text key={i} color="informationFont">{`${tagihanData.info.info.length == 1 ? "" : `${i + 1}. `}${item}`}</Text>
								))}
							</View>
						}
					</View>
			}
		</Body>
		<Footer>
			{
				tagihanData &&
				<Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
					BAYAR
            </Button>
			}
		</Footer>
	</Container >
}
export default ListrikPascabayar