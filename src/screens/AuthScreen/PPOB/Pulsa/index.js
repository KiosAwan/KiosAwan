import React, { useState, useEffect } from 'react';
import Container, { Body } from 'src/components/View/Container';
import styles from './PulsaStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity, Modal as RNModal } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import { Input } from 'src/components/Input/MDInput';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getProductPulsa, payPulsaHandphone } from 'src/utils/api/ppob/pulsa_api';
import { convertRupiah, verifyUserPIN, getUserToken } from 'src/utils/authhelper';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import GlobalEnterPin from '../../GlobalEnterPin';
import { getProfile } from 'src/redux/actions/actionsUserData';
import ContactsModal from 'src/components/ModalContent/ContacsModal';
import SwitchButton from 'src/components/Button/SwitchButton';
import Icon from 'react-native-vector-icons/FontAwesome5';

const PpobPulsa = ({ navigation }) => {
	//Initialize dispatch
	const dispatch = useDispatch()
	// Reducer for product data
	const Product = useSelector(state => state.Product)
	//Reducer User data
	const User = useSelector(state => state.User)
	//Phone number state
	const [phoneNumber, setPhoneNumber] = useState("")
	const [selected, setSelected] = useState()
	//Favorite transaction
	const [favorit, setFavorit] = useState()
	//Product state
	const [data, setData] = useState()

	// alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	// PIN Modal state 
	const [pinVisible, setPinVisible] = useState(false)

	// Loading pay state
	const [payLoading, setPayLoading] = useState(false)

	// PIN Modal state 
	const [contactVisible, setContactVisible] = useState(false)

	const _selectPulsa = ({ item, index }) => {
		setSelected(item)
		setPinVisible(true)
	}

	//Function onchange phone number
	const _onChangePhoneNum = async text => {
		setPhoneNumber(text)
		let x = {
			phone_number: text,
			type: "pulsa"
		}
		let res = await getProductPulsa(x)
		if (res.status == 200) {
			setSelected()
			if (res.data.length == 0) {
				setData()
			} else {
				setData(res.data)
			}
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
			phone_number: phoneNumber,
			productID: selected.code,
			id_multi: Product.id_multi,
			favorite: favorit ? 1 : 0
		}
		const res = await payPulsaHandphone(data)
		setPayLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			const data = { type: "Pulsa", customerID: res.data.transaction.customerID, price: parseInt(res.data.transaction.total), productName: selected.name }
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
	useEffect(() => {
		if (navigation.state.params) {
			let { customerID } = navigation.state.params
			_onChangePhoneNum(customerID)
		}
	}, [])
	return <Container header={{
		title: "Pulsa",
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
		<RNModal visible={contactVisible} animationType="slide" onRequestClose={() => setContactVisible(false)}>
			<ContactsModal closeModal={() => setContactVisible(false)}
				chooseContact={
					(num) => {
						_onChangePhoneNum(num)
					}
				}
			/>
		</RNModal>
		<Body>
			<Wrapper justify="space-between">
				<Input
					_width="85%"
					label="No. Handphone"
					value={phoneNumber}
					onChangeText={_onChangePhoneNum}
					keyboardType="phone-pad"
					renderRightAccessory={() => <Image source={data ? { uri: data.provider.image } : require('src/assets/icons/phone.png')} size={20} />}
				/>
				<Button _width="10%" padding={7} onPress={() => setContactVisible(true)}>
					<Icon name="address-book" size={20} color={ColorsList.white} />
				</Button>
			</Wrapper>
			{
				__DEV__ && <View>
					<Text align="center">Ga usah di ilangin bet, ini ada klo <Text>dev</Text> doang</Text>
					<FlatList
						style={{}}
						numColumns={3}
						data={["081320002755", "085856740755", "087861573755", "089636289755", "083811572755", "088212075755"]}
						keyExtractor={(a, i) => i.toString()}
						renderItem={({ item }) => <Button flex onPress={() => _onChangePhoneNum(item)}>{item}</Button>}
					/>
				</View>
			}
			<View style={styles.simpan}>
				<Text>Simpan ke favorit</Text>
				<SwitchButton
					handleChangeToggle={_handleChangeToggle}
					toggleValue={favorit}
				/>
			</View>
			{data &&
				<View style={{ flex: 1, padding: 10, backgroundColor: "white", elevation: 1, borderRadius: 10 }}>
					<Text style={{ marginBottom: 5 }}>Pilih nominal pulsa: <Text font="SemiBold">{data.products[0].name.split(" ")[0]}</Text></Text>
					<FlatList style={styles.listPulsa} keyExtractor={(a, i) => i.toString()}
						showsVerticalScrollIndicator={false}
						data={data ? data.products : []}
						renderItem={({ item, index }) =>
							<TouchableOpacity onPress={() => _selectPulsa({ item, index })}>
								<Wrapper spaceBetween style={[styles.pulsaWrapper, item == selected && styles.pulsaWrapperActive]}>
									<View _width="70%">
										<Text font="SemiBold" style={{ marginLeft: 5 }} color="primary">{`PULSA ${item.name.split(" ")[2]}`} </Text>
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
	</Container>
}
export default PpobPulsa