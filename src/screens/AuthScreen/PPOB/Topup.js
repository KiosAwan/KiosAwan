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

const Topup = ({ navigation }) => {
	const [topupValue, setTopupValue] = useState(0)
	const [topupMethod, setTopupMethod] = useState()
	const [listPaymentMethod, setListPaymentMethod] = useState([])
	const [apiLoading, setApiLoading] = useState(false)
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const User = useSelector(state => state.User)
	const TopupMethods = [{
		title: 'BCA Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue + 3000),
		image: require('src/assets/icons/ppob/topup/BCA.png'),
		key: 702
	}, {
		title: 'Mandiri Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue + 3000),
		image: require('src/assets/icons/ppob/topup/Mandiri.png'),
		key: 802
	}, {
		title: 'BNI Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue + 3000),
		image: require('src/assets/icons/ppob/topup/BNI.png'),
		key: 801
	}, {
		title: 'BRI Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue + 3000),
		image: require('src/assets/icons/ppob/topup/BRI.png'),
		key: 800
	}]

	useEffect(() => {
		_getPaymentData()
	}, [])

	// Get payment channel List data
	const _getPaymentData = async () => {
		const res = await getPaymentChannelList()
		setListPaymentMethod(res.data)
	}

	const _selectTopupMethod = (item, i) => {
		setTopupMethod(item.id)
	}

	const _pressAddTopUpValue = (value) => {
		console.debug("value", value)
		console.debug(topupValue)
		if (!topupValue) {
			setTopupValue(value)
		} else {
			if (Number(topupValue)) {
				let a = parseInt(topupValue) + parseInt(value)
				setTopupValue(a)
			} else {
				let a = parseInt(topupValue.extractNumber()) + parseInt(value)
				setTopupValue(a)
			}
		}
	}

	const _handleTopUp = async () => {
		setApiLoading(true)
		const data = {
			amount: topupValue,
			payment_channel: topupMethod
		}
		const res = await requestTopUp(data)
		setApiLoading(false)
		if (res.status == 200) {
			navigation.navigate('/ppob/topup/detail', { response: res.data })
		} else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		} else {
			setAlertMessage(JSON.stringify(res))
			setAlert(true)
		}
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
			<ScrollView style={{ padding: 15, marginBottom: 70 }}>
				<Wrapper style={styles.group} justify="space-between">
					<Text>Saldo Kios Awan</Text>
					<Text>{convertRupiah(User.data.saldo)}</Text>
				</Wrapper>
				<View style={[styles.group]}>
					<FloatingInputLabelCurrency style={{ margin: 0 }}
						value={topupValue.toString()}
						handleChangeText={text => setTopupValue(text)}
						label="Nominal Top Up"
					/>
					<Text size={10} font="Regular" color="primary">Nominal Kelipatan {convertRupiah(100000)}</Text>
					<FlatList style={{ marginTop: 10 }} data={[100000, 200000, 500000]}
						numColumns={3}
						renderItem={({ item }) => <Button onPress={() => _pressAddTopUpValue(item)} width="31.333%" style={{ marginHorizontal: '1%' }} color="white" textStyle={{ fontSize: 12 }}>{`+ ${convertRupiah(item)}`}</Button>}
						keyExtractor={(item, i) => i.toString()} />
				</View>
				<Text style={{ marginBottom: 10 }} font="Regular" align="center">Metode Pembayaran</Text>
				{listPaymentMethod.map((item, i) => (
					<Accordion key={i} style={[styles.group, { padding: 0 }]} titleColor="primary" button={{ disabled: topupValue > 0 ? false : true, color: 'link' }} title={
						<Wrapper justify="flex-start">
							<Image size={25} style={{ marginRight: 10, }} source={require('src/assets/icons/ppob/topup/VirtualAccount.png')} />
							<Text>{item.type}</Text>
						</Wrapper>
					}>
						<View style={{ paddingVertical: 5, backgroundColor: ColorsList.authBackground }}>
							{item.data.map((list, ind) => (
								<Button onPress={() => _selectTopupMethod(list, ind)} style={{ marginVertical: 5 }} noBorder={!(topupMethod == list.id)} color="white">
									<Image style={{ resizeMode: 'contain', width: 70, height: 50 }} source={{uri : list.image}} />
									<View>
										<Text color="primary">{list.name}</Text>
										<Text size={12}>{`Total pembayaran + ${convertRupiah(topupValue + parseInt(list.fee))}`}</Text>
									</View>
								</Button>
							))}
						</View>
					</Accordion>
				))}
				{/* <Accordion style={[styles.group, { padding: 0 }]} titleColor="greyFont" button={{ disabled: true, color: 'link' }} title={
					<Wrapper justify="flex-start">
						<Image size={25} style={{ marginRight: 10, }} source={require('src/assets/icons/ppob/topup/Rekening.png')} />
						<Text>Transfer ke Rekening Bank</Text>
					</Wrapper>
				}>
					<Text>Dolore fugiat labore reprehenderit nulla ea adipisicing velit commodo pariatur. Non est fugiat non proident adipisicing cillum officia culpa fugiat irure. Nisi dolor excepteur eiusmod occaecat proident cillum officia eiusmod elit. Consequat laboris sint ut cillum mollit ex laborum qui irure reprehenderit excepteur. Elit aliquip commodo nulla eiusmod nostrud tempor proident non ea culpa minim ea commodo voluptate. Aliquip nostrud ea officia excepteur ullamco Lorem reprehenderit exercitation veniam. Aliqua reprehenderit consequat laboris aute consectetur elit esse sit.</Text>
				</Accordion> */}
			</ScrollView>
			<Bottom>
				<Button disabled={topupValue > 0 ? topupMethod >= 0 ? false : true : true} onPress={_handleTopUp} width="100%">TOPUP DENGAN VIRTUAL ACCOUNT</Button>
			</Bottom>
		</View>
	)
}

export default Topup;

const styles = StyleSheet.create({
	group: { backgroundColor: ColorsList.whiteColor, padding: 10, borderRadius: 5, marginBottom: 10 }
})