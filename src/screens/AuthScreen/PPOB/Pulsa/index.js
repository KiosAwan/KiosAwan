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
import { Modal } from 'src/components/ModalContent/Popups';
import SearchInput from 'src/components/Input/SearchInput';
import { getProductPulsa } from 'src/utils/api/ppob/pulsa_api';
import { convertRupiah } from 'src/utils/authhelper';
import { useDispatch } from 'react-redux';
import { AddPPOBToCart } from 'src/redux/actions/actionsPPOB';

const PpobPulsa = ({ navigation }) => {
	//Initialize dispatch
	const dispatch = useDispatch()

	//Phone number state
	const [phoneNumber, setPhoneNumber] = useState()
	const [selected, setSelected] = useState()
	//Product state
	const [data, setData] = useState()

	const _selectPulsa = ({ item, index }) => {
		setSelected(index)
		const data = { type: "pulsa", customerID: phoneNumber, productID: item.code, price: item.price, productName: item.name }
		dispatch(AddPPOBToCart(data))
		navigation.goBack()
	}
	const [modal, setModal] = useState(false)

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
	return <Container header={{
		title: "Pulsa",
		image: require('src/assets/icons/phonebook.png'),
		onPressIcon: () => setModal(true),
		onPressBack: () => navigation.goBack(),
	}}>
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
				<TouchableOpacity onPress={() => _selectPulsa({ item, index })} style={[styles.pulsaWrapper, index === selected && styles.pulsaWrapperActive]}>
					<Text style={styles.pulsaComp}>{item.type}</Text>
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