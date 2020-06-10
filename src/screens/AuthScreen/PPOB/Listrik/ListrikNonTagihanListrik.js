import React, { useState, useEffect } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, ActivityIndicator } from 'react-native';
import { $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import MDInput, { Input } from 'src/components/Input/MDInput';
import { checkTagihanListrik, payTagihanListrik, payTagihanNonTagList, checkTagihanNonTagList } from 'src/utils/api/ppob/listrik_api';
import { convertRupiah, verifyUserPIN, getUserToken } from 'src/utils/authhelper';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import GlobalEnterPin from '../../GlobalEnterPin';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getProfile } from 'src/redux/actions/actionsUserData';
import SwitchButton from 'src/components/Button/SwitchButton';

const ListrikNonTagihanListrik = ({ navigation }) => {
	const dispatch = useDispatch()
	//Reducer for product data
	const Product = useSelector(state => state.Product)
	//User data
	const User = useSelector(state => state.User)
	const [custId, setCustId] = useState('')
	// 520060002607
	const [] = useState()
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

	//Function for check tagihan
	const _cekTagihan = async (x) => {
		setTagihanLoading(true)
		setTagihanData()
		const params = {
			productID: 100311,
			customerID: x
		}
		const { status, data } = await checkTagihanNonTagList(params)
		setTagihanLoading(false)
		if (status == 400) {
			setAlertMessage(data.errors.msg)
			setAlert(true)
		} else {
			setTagihanData(data)
		}
	}
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
			favorite: favorit ? 1 : 0
		}
		const res = await payTagihanNonTagList(data)
		setPayLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			const data = {
				type: "nontaglist",
				customerID: res.data.transaction.customerID,
				price: parseInt(res.data.transaction.total),
				productName: "Non Tagihan Listrik"
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
		title: "Non Tagihan Listrik",
		// image: require('src/assets/icons/phonebook.png'),
		// onPressIcon: () => setModal(true),
		onPressBack: () => navigation.goBack(),
	}}>
		<Body>
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
					{__DEV__ && <Button onPress={() => {
						setCustId('1412015027820')
						_cekTagihan('1412015027820')
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
					<Text>Simpan ke favorit</Text>
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
						<View style={{ elevation : 1, borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Nama Pelanggan</Text>
								<Text font="Regular">{tagihanData.transaction.nama}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Jenis transaksi</Text>
								<Text font="Regular">{tagihanData.transaction.jenis_transaksi}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">No Registrasi</Text>
								<Text font="Regular">{tagihanData.transaction.no_registrasi}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Jumlah Tagihan</Text>
								<Text font="Regular">{convertRupiah(tagihanData.transaction.tagihan)}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Denda</Text>
								<Text font="Regular">{convertRupiah(tagihanData.transaction.denda)}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Admin</Text>
								<Text font="Regular">{convertRupiah(tagihanData.transaction.admin)}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={{ padding: 10 }}>
								<Text font="Regular">Total Tagihan</Text>
								<Text font="Regular">{convertRupiah(
									parseInt(tagihanData.transaction.total)
								)}</Text>
							</Wrapper>
						</View>
						{tagihanData && tagihanData.info &&
							<View style={styles.infoPembelian}>
								<Text size={16} font="SemiBold" color="informationFont">{tagihanData.info.title}</Text>
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
export default ListrikNonTagihanListrik