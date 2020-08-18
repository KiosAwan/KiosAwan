import React, { useState, useEffect } from 'react';

import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text } from 'src/components/Text/CustomText';
import { convertRupiah, getNearestFifty, payCredit, convertNumber, getUserToken } from 'src/utils/authhelper';
import { ToggleButtonMoney } from 'src/components/Picker/SelectBoxModal';
import { RowChild } from 'src/components/Helper/RowChild';
import { FloatingInputLabelCurrency } from 'src/components/Input/InputComp';
import Storage from 'src/utils/keyStores';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { ImageAuto } from 'src/components/CustomImage';
import { Input } from 'src/components/Input/MDInput';
import { SizeList } from 'src/styles/size';

const initialLayout = { width: 300, height: 300 };

const TransactionDetailLunasi = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const [dataUtang, setDataUtang] = useState()
	const [loading, setLoading] = useState(true)
	const [amount_payment, setAmountPayment] = useState(0)
	const [nonTunai, setNonTunai] = useState("")
	useEffect(() => {
		const { paramData } = navigation.state.params
		setDataUtang(paramData)
		setLoading(false)
	}, [])

	const pressCard = (id) => {
		setNonTunai(id)
	}

	const nonTunaiList = [
		{
			title: "BCA",
			image: require('src/assets/payment/bca.png'),
			id: 1
		},
		{
			title: "Mandiri",
			image: require('src/assets/payment/mandiri.png'),
			id: 2
		},
		{
			title: "BRI",
			image: require('src/assets/payment/bri.png'),
			id: 3
		},
		{
			title: "BNI",
			image: require('src/assets/payment/bni.png'),
			id: 4
		},
		{
			title: "Gopay",
			image: require('src/assets/payment/gopay.png'),
			id: 5
		},
		{
			title: "DANA",
			image: require('src/assets/payment/dana.png'),
			id: 6
		},
		{
			title: "OVO",
			image: require('src/assets/payment/ovo.png'),
			id: 7
		},
		{
			title: "Link Aja",
			image: require('src/assets/payment/linkaja.png'),
			id: 8
		}
	]

	const _handlePayCredit = async () => {
		const userId = await Storage.getItem('userId')
		const data = {
			amount_payment: convertNumber(amount_payment),
			cashier: userId,
			id_payment_type : index + 1,
			payment_method : nonTunai
		}
		const res = await payCredit(data, dataUtang.transaction.id_transaction)
		const userToken = await getUserToken()
		if (res.status == 200) {
			dispatch(getTransactionList(User.store.id_store, userToken))
			navigation.navigate('/')
		} else if (res.status == 400) {
			alert(res.data.errors.msg)
		}
	}
	const _renderKembalian = () => {
		try {
			if (amount_payment.extractNumber() - dataUtang.debt.remaining_debt >= 0)
				return `Kembalian: ${convertRupiah(amount_payment.extractNumber() - dataUtang.debt.remaining_debt)}`
		} catch (err) { }
		return null
	}

	const _handleChangePayment = (text) => {
        let x = text.extractNumber()
        setAmountPayment(x)
    }
	const Tunai = ({ route }) => {
		return (
			<View style={{ padding: 15, flex: 1 }}>
				{
					route.key == 'first' ?
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{ padding: 20, backgroundColor: ColorsList.whiteColor }}>
								<Input style={{ margin: 0 }}
									currency
									noShadow
									value={amount_payment.toString()}
									onChangeText={_handleChangePayment}
									label="Uang yang diterima"
									keyboardType="number-pad"
								/>
								<Text color="primary">{_renderKembalian()}</Text>
								<View style={{ ...RowChild, marginTop: SizeList.base }}>
									<ToggleButtonMoney
										style={{ marginRight: 10 }}
										onPress={(value) => setAmountPayment(value.toString())}
										buttons={[dataUtang.debt.remaining_debt, getNearestFifty(dataUtang.debt.remaining_debt, 1)]}
									/>
								</View>
							</View>
						</ScrollView>
						:
						<NonTunai />
				}
			</View>
		)
	}
	const NonTunai = props => {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ backgroundColor: ColorsList.whiteColor, padding: 10, paddingTop: 0 }}>
					{nonTunaiList.rMap((item, i) => (
						<TouchableOpacity style={[styles.card, nonTunai == i + 1 ? styles.selectedNonTunai : null]}
							onPress={() => pressCard(i + 1)}
						>
							<View style={{ width: 60, height: 30, marginHorizontal: 20 }}>
								<ImageAuto style={{ resizeMode: "contain" }} source={item.image} />
							</View>
							<Text>{item.title}</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		)
	}

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'TUNAI' },
		{ key: 'second', title: 'NON TUNAI' }
	]);

	const renderScene = SceneMap({
		first: Tunai,
		second: NonTunai,
	});
	const [viewDetail, setViewDetail] = useState(false)
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader onPressBack={() => navigation.goBack()} title="Lunasi" />
			{loading ? <Text>adfs</Text> :
				<View style={{ flex: 1 }}>
					<ScrollView>
						<View style={{ flex: 1, marginBottom: 60 }}>
							<TabView
								renderTabBar={props => {
									const width = 100 / props.navigationState.routes.length
									return (
										<View>
											<View style={{ backgroundColor: ColorsList.whiteColor }}>
												<Wrapper style={{ padding: 15 }}>
													{
														props.navigationState.routes.rMap((route, i) => {
															return <Button disabled={index == i} onPress={() => setIndex(i)} color={index == i ? 'primary' : 'white'} _width={`${width}%`} style={{ borderRadius: 0 }}>{route.title}</Button>
														})
													}
												</Wrapper>
											</View>
											<View style={{ padding: 15, paddingBottom: 0 }}>
												<Wrapper justify="space-between" style={{ marginBottom: 5, padding: 20, backgroundColor: ColorsList.whiteColor }}>
													<Wrapper direction="column">
														<Text>Total Tagihan : <Text font="SemiBold" color="primary">{convertRupiah(dataUtang.debt.remaining_debt)}</Text></Text>

													</Wrapper>
												</Wrapper>
											</View>
										</View>
									)
								}}
								navigationState={{ index, routes }}
								renderScene={Tunai}
								onIndexChange={setIndex}
								initialLayout={initialLayout}
							/>
						</View>
					</ScrollView>
					<Bottom>
						<Button onPress={_handlePayCredit} width="100%">LUNASI</Button>
					</Bottom>
				</View>
			}
		</View>
	);
}

export default TransactionDetailLunasi

const styles = StyleSheet.create({
	wrapperImage: { width: 80, height: 35, padding: 5, borderRadius: 5, borderWidth: 1, borderColor: ColorsList.greyAuthHard },
	imagePayment: { height: 35, width: 100 },
	containerEmptyData: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	containerWithData: {
		flex: 1
	},
	selectedNonTunai: {
		borderWidth: 1,
		borderColor: ColorsList.primary
	},
	card: {
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: ColorsList.greyAuthHard,
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 5
	},
	imagePayment: {
		height: 35,
		width: 80,
		resizeMode: 'contain'
	},
})