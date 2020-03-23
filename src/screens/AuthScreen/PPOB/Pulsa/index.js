import React, { useState } from 'react';
import Container from 'src/components/View/Container';
import styles from './PulsaStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { $Padding } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Modal, AwanPopup } from 'src/components/ModalContent/Popups';
import SearchInput from 'src/components/Input/SearchInput';
import { getProductPulsa,payPulsaHandphone } from 'src/utils/api/ppob/pulsa_api';
import { convertRupiah, verifyUserPIN } from 'src/utils/authhelper';
import { useDispatch,useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import GlobalEnterPin from '../../GlobalEnterPin';

const PpobPulsa = ({ navigation }) => {
	//Initialize dispatch
	const dispatch = useDispatch()
	// Reducer for product data
	const Product = useSelector(state => state.Product)
	//Reducer User data
	const User = useSelector(state => state.User)
	const [modal, setModal] = useState(false)
	//Phone number state
	const [phoneNumber, setPhoneNumber] = useState("085856740755")
	const [selected, setSelected] = useState()
	//Product state
	const [data, setData] = useState()

	// alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	// PIN Modal state 
	const [pinVisible, setPinVisible] = useState(false)

	// Loading pay state
	const [payLoading, setPayLoading] = useState(false)

	const _selectPulsa = ({ item, index }) => {
		setSelected(item)
		setPinVisible(true)
	}

	//Function onchange phone number
	const _onChangePhoneNum = async (text) => {
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
			id_multi: Product.id_multi
		}
		const res = await payPulsaHandphone(data)
		setPayLoading(false)
		if (res.status == 200) {
			const data = { type: "Pulsa", customerID: res.data.transaction.customerID, price: parseInt(res.data.transaction.total), productName: selected.name }
			dispatch(AddPPOBToCart(data))
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
		title: "Pulsa",
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
		<Modal backdropDismiss={() => setModal(false)} visible={modal}>
			<View>
				<Text size={17} align="center">Nomor Pelanggan</Text>
				<SearchInput textInput={{
					placeholder: 'Cari nomor'
				}} />
				<ScrollView persistentScrollbar style={{ maxHeight: 250, marginTop: 10 }}>
					{[1, 2, 3, 4, 5, 6]
						.map((item, i) => [
							<Button color="link">Albert Stanley - 123456789123456789</Button>,
							i != 5 && <Divider />
						])
					}
				</ScrollView>
			</View>
		</Modal>
		<View style={styles.topComp}>
			<Wrapper justify="space-between" style={$Padding(5, 15)}>
				<MDInput _width="80%"
					label="No. Handphone"
					value={phoneNumber}
					onChangeText={_onChangePhoneNum}
					keyboardType="phone-pad"
				/>
				<Image style={{ borderWidth: 1, borderColor: ColorsList.greyAuthHard }} source={data ? { uri: data.provider.image } : require('src/assets/icons/phone.png')} size={50} />
			</Wrapper>
		</View>
		<FlatList style={styles.listPulsa} numColumns={2} keyExtractor={(a, i) => i.toString()}
			columnWrapperStyle={{ justifyContent: 'space-between', }}
			showsVerticalScrollIndicator={false}
			data={data ? data.products : []}
			renderItem={({ item, index }) =>
				<TouchableOpacity onPress={() => _selectPulsa({ item, index })} style={[styles.pulsaWrapper, item === selected && styles.pulsaWrapperActive]}>
					<Text style={styles.pulsaComp}>{item.type.ucfirst()}</Text>
					<Text color="primary" style={styles.pulsaComp}>{item.name}</Text>
					<View style={{ borderTopWidth: 1, borderTopColor: ColorsList.greyAuthHard }}>
						<Text style={styles.pulsaComp}>Harga: {convertRupiah(item.price)}</Text>
					</View>
				</TouchableOpacity>
			}
		/>
	</Container>
}
export default PpobPulsa