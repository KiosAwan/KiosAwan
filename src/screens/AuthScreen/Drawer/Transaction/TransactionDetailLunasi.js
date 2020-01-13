import React, { useState, useEffect } from 'react';

import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text } from 'src/components/Text/CustomText';
import { convertRupiah, getNearestFifty, payCredit, convertNumber } from 'src/utils/authhelper';
import { ToggleButtonMoney } from 'src/components/Picker/SelectBoxModal';
import { RowChild } from 'src/components/Helper/RowChild';
import { FloatingInput } from 'src/components/Input/InputComp';
import AsyncStorage from '@react-native-community/async-storage';
import { InputCurrency } from 'src/components/Input/InputComp';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { TouchableOpacity } from 'react-native-gesture-handler';

const initialLayout = { width: 300, height: 300 };

const TransactionDetailLunasi = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const [dataUtang, setDataUtang] = useState()
	const [loading, setLoading] = useState(true)
	const [amount_payment, setAmountPayment] = useState('')
	const [nonTunai , setNonTunai] = useState()
	useEffect(() => {
		const { paramData } = navigation.state.params
		setDataUtang(paramData)
		setLoading(false)
	}, [])

	const _handlePayCredit = async () => {
		const userId = await AsyncStorage.getItem('userId')
		const data = {
			amount_payment: convertNumber(amount_payment),
			cashier: userId
		}
		try {
			const res = await payCredit(data, dataUtang.transaction.id_transaction)
			dispatch(getTransactionList(User.store.id_store))
			navigation.navigate('/drawer/transaction')
		}
		catch (err) {
			alert(err.response.data.data.errors.msg)
		}
	}
	const _renderKembalian = () => {
		try {
			if (amount_payment.extractNumber() - dataUtang.debt.remaining_debt >= 0)
				return `Kembalian: ${convertRupiah(amount_payment.extractNumber() - dataUtang.debt.remaining_debt)}`
		} catch (err) { }
		return null
	}
	const Tunai = ({ route }) => {
		return (
			<View style={{ padding: 15, flex: 1 }}>
				{
					route.key == 'first' ?
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{ padding: 20, backgroundColor: ColorsList.whiteColor }}>
								<FloatingInput label="Uang yang diterima" style={{ margin: 0 }}>
									<InputCurrency
										value={amount_payment}
										onChangeText={(text) => setAmountPayment(text)} />
								</FloatingInput>
								<Text color="primary">{_renderKembalian()}</Text>
								<View style={{ ...RowChild, marginTop: 20 }}>
									<ToggleButtonMoney
										style={{ marginRight: 10 }}
										onPress={(value) => setAmountPayment(value.toString())}
										buttons={[dataUtang.debt.remaining_debt, getNearestFifty(dataUtang.debt.remaining_debt,1)]}
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


	const propsTitleText = { size: 17, font: 'ExtraBold', style: { marginVertical: 15, borderBottomColor: ColorsList.greyAuthHard, borderBottomWidth: 1, textAlign: 'center' } }

	const NonTunai = props => {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ backgroundColor: ColorsList.whiteColor, padding: 20, paddingTop: 0 }}>
					<Text {...propsTitleText}>DEBIT</Text>
					<Wrapper>
						<TouchableOpacity style={[styles.wrapperImage, nonTunai == 1 ? styles.selectedNonTunai : null]} onPress={() => setNonTunai(1)}>
							<Image source={require('src/assets/payment/bca.png')} style={styles.imagePayment} name="BCA" />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.wrapperImage, nonTunai == 2 ? styles.selectedNonTunai : null]} onPress={() => setNonTunai(2)}>
							<Image source={require('src/assets/payment/mandiri.png')} style={styles.imagePayment} name="Mandiri" />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.wrapperImage, nonTunai == 3 ? styles.selectedNonTunai : null]} onPress={() => setNonTunai(3)}>
							<Image source={require('src/assets/payment/bri.png')} style={styles.imagePayment} name="BRI" />
						</TouchableOpacity>
					</Wrapper>
					<Text {...propsTitleText}>E-WALLET</Text>
					<Wrapper>
						<TouchableOpacity style={[styles.wrapperImage, nonTunai == 4 ? styles.selectedNonTunai : null]} onPress={() => setNonTunai(4)}>
							<Image source={require('src/assets/payment/gopay.png')} style={styles.imagePayment} name="Gopay" />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.wrapperImage, nonTunai == 5 ? styles.selectedNonTunai : null]} onPress={() => setNonTunai(5)}>
							<Image source={require('src/assets/payment/dana.png')} style={styles.imagePayment} name="Dana" />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.wrapperImage, nonTunai == 6 ? styles.selectedNonTunai : null]} onPress={() => setNonTunai(6)}>
							<Image source={require('src/assets/payment/ovo.png')} style={styles.imagePayment} name="OVO" />
						</TouchableOpacity>
					</Wrapper>
				</View>
			</ScrollView>
		)
	}

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Tunai' },
		{ key: 'second', title: 'Non Tunai' }
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
					<View style={{ flex: 1, marginBottom: 60 }}>
						<TabView
							renderTabBar={props => {
								const width = 100 / props.navigationState.routes.length
								return (
									<View>
										<View style={{ backgroundColor: ColorsList.whiteColor }}>
											<Wrapper style={{ padding: 15 }}>
												{
													props.navigationState.routes.map((route, i) => {
														return <Button disabled={index == i} onPress={() => setIndex(i)} color={index == i ? 'primary' : 'white'} _width={`${width}%`} style={{ borderRadius: 0 }}>{route.title}</Button>
													})
												}
											</Wrapper>
										</View>
										<View style={{ padding: 15, paddingBottom: 0 }}>
											<Wrapper justify="space-between" style={{ marginBottom: 5, padding: 20, backgroundColor: ColorsList.whiteColor }}>
												<Wrapper direction="column">
													<Text font="Bold">Total Tagihan</Text>
													<Text color="primary" font="ExtraBold" size={30}>{convertRupiah(dataUtang.debt.remaining_debt)}</Text>
												</Wrapper>
												{/* <View style={{ justifyContent: 'flex-end' }}>
											<TouchableOpacity onPress={() => setViewDetail(!viewDetail)}>
												<Text font="Bold" size={18}>DETAIL</Text>
											</TouchableOpacity>
										</View> */}
											</Wrapper>
											{
												viewDetail ?
													<View>
														<Wrapper justify="space-between" style={{ marginBottom: 5, padding: 20, backgroundColor: ColorsList.whiteColor }}>
															<Wrapper direction="column">
																<Text color="primary" font="ExtraBold" size={18}>Nama Produk</Text>
																<Text font="Bold">Rp. 25.000 x 2</Text>
															</Wrapper>
															<View style={{ justifyContent: 'flex-end' }}>
																<Text font="Bold" size={16}>Rp. 50.000</Text>
															</View>
														</Wrapper>
														<Wrapper justify="space-between" style={{ padding: 20, backgroundColor: ColorsList.whiteColor }}>
															<Text font="Bold">Subtotal</Text>
															<Text font="Bold" size={18}>Rp. 50.000</Text>
														</Wrapper>
													</View> : null
											}
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
	wrapperImage: { padding: 5, borderRadius: 5, borderWidth: 1, borderColor: ColorsList.greyAuthHard },
	imagePayment: { height: 35, width: 100 },
	containerEmptyData: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	containerWithData: {
		flex: 1
	},
	selectedNonTunai : {
		borderWidth : 1, 
		borderColor : ColorsList.primary
	}
})