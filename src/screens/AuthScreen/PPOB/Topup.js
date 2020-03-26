import React, { useState, useEffect } from 'react'
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { convertRupiah } from 'src/utils/authhelper';
import { FloatingInputLabelCurrency } from 'src/components/Input/InputComp';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Image } from 'src/components/CustomImage';
import Accordion from 'src/components/View/Accordion';
import { Bottom } from 'src/components/View/Bottom';
import { useSelector } from 'react-redux';
import { requestTopUp } from 'src/utils/api/ppobapi';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getPaymentChannelList } from 'src/utils/api/topup_api';
import Divider from 'src/components/Row/Divider';

const Topup = ({ navigation }) => {
	const [topupValue, setTopupValue] = useState(0)
	const [topupMethod, setTopupMethod] = useState()
	const [listPaymentMethod, setListPaymentMethod] = useState([])
	const [apiLoading, setApiLoading] = useState(false)
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const User = useSelector(state => state.User)

	useEffect(() => {
		_getPaymentData()
	}, [])

	// Get payment channel List data
	const _getPaymentData = async () => {
		const res = await getPaymentChannelList()
		setListPaymentMethod(res.data)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<AwanPopup.Loading visible={apiLoading} />
			<GlobalHeader title="Top Up" onPressBack={() => navigation.goBack()} />
			<View style={{ flex: 1, marginTop : 15 }}>
				<ScrollView style={{ paddingHorizontal: 15 }}>
					<View style={styles.group} justify="space-between">
						<Text>Saldo Kios Awan</Text>
						<Text color="primary" size={20} font="Bold">{convertRupiah(User.data.saldo)}</Text>
						<Divider style={{ marginVertical: 10 }} />
						<Text>Minimal top up Rp 50.000 , kelipatan Rp 1.000</Text>
					</View>
					<Text style={{ marginBottom: 10 }} font="Regular" align="center">Metode Pembayaran</Text>
					{listPaymentMethod.map((item, i) => (
						<Accordion key={i} style={[styles.group, { padding: 0 }]} titleColor="primary" button={{ color: 'link' }} title={
							<Wrapper justify="flex-start">
								<Image size={25} style={{ marginRight: 10, }} source={require('src/assets/icons/ppob/topup/VirtualAccount.png')} />
								<Text>{item.type}</Text>
							</Wrapper>
						}>
							<View style={{ paddingVertical: 5, backgroundColor: ColorsList.authBackground }}>
								{item.data.map((list, ind) => (
									<Button onPress={() => _selectTopupMethod(list, ind)} style={{ marginVertical: 5 }} noBorder={!(topupMethod == list.id)} color="white">
										<Image style={{ resizeMode: 'contain', width: 70, height: 50 }} source={{ uri: list.image }} />
										<View>
											<Text color="primary">{list.name}</Text>
											<Text size={12}>{`Total pembayaran + ${convertRupiah(topupValue + parseInt(list.fee))}`}</Text>
										</View>
									</Button>
								))}
							</View>
						</Accordion>
					))}
				</ScrollView>
			</View>
		</View>
	)
}

export default Topup;

const styles = StyleSheet.create({
	group: { backgroundColor: ColorsList.whiteColor, padding: 10, borderRadius: 5, marginBottom: 10 }
})