import React, { useState, useEffect } from 'react';

import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Button, Wrapper, Bottom } from 'src/components/Button/ButtonComp';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text } from 'src/components/Text/CustomText';
import { convertRupiah, getNearestFifty, payCredit } from 'src/utils/authhelper';
import { ToggleButtonMoney } from 'src/components/Picker/SelectBoxModal';
import { RowChild } from 'src/components/Helper/RowChild';
import { FloatingInputLabelCurrency } from 'src/components/Input/InputComp';
import AsyncStorage from '@react-native-community/async-storage';

const initialLayout = { width: 300, height: 300 };

const TransactionDetailLunasi = ({ navigation }) => {

	const [dataUtang, setDataUtang] = useState()
	const [loading, setLoading] = useState(true)
	const [amount_payment, setAmountPayment] = useState()
	useEffect(() => {
		const { paramData } = navigation.state.params
		setDataUtang(paramData)
		setLoading(false)
	}, [])

	const _handlePayCredit = async () => {
		const userId = await AsyncStorage.getItem('userId')
		const data = {
			amount_payment,
			cashier: userId
		}
		try {
			const res = await payCredit(data, dataUtang.transaction.id_transaction)
			navigation.goBack()
		}
		catch (err) {
			alert(err.response.data.data.errors.msg)
		}
	}
	const Tunai = props => {
		return (
			<View style={{ padding: 15, flex: 1 }}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={{ padding: 20, backgroundColor: ColorsList.whiteColor }}>
						<FloatingInputLabelCurrency style={{ margin: 0 }}
							value={amount_payment}
							handleChangeText={(text) => setAmountPayment(text)}
							label="Uang yang diterima"
						/>
						<Text color="primary">{amount_payment - dataUtang.debt.remaining_debt >= 0 ? `Kembalian: ${convertRupiah(amount_payment - dataUtang.debt.remaining_debt)}` : null} </Text>
						<View style={{ ...RowChild, marginTop: 20 }}>
							<ToggleButtonMoney
								style={{ marginRight: 10, }}
								onPress={(value) => setAmountPayment(value)}
								buttons={[dataUtang.debt.remaining_debt, getNearestFifty(dataUtang.debt.remaining_debt, 1)]}
							/>
						</View>
					</View>
				</ScrollView>
			</View>
		)
	}


	const propsTitleText = { size: 17, font: 'ExtraBold', style: { marginVertical: 15, borderBottomColor: ColorsList.greyAuthHard, borderBottomWidth: 1, textAlign: 'center' } }

	const NonTunai = props => {
		return (
			<View style={{ padding: 15, flex: 1 }}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={{ backgroundColor: ColorsList.whiteColor, padding: 20, paddingTop: 0 }}>
						<Text {...propsTitleText}>DEBIT</Text>
						<Wrapper>
							<View style={styles.wrapperImage}>
								<Image source={require('src/assets/payment/bca.png')} style={styles.imagePayment} name="BCA" />
							</View>
							<View style={styles.wrapperImage}>
								<Image source={require('src/assets/payment/mandiri.png')} style={styles.imagePayment} name="Mandiri" />
							</View>
							<View style={styles.wrapperImage}>
								<Image source={require('src/assets/payment/bri.png')} style={styles.imagePayment} name="BRI" />
							</View>
						</Wrapper>
						<Text {...propsTitleText}>E-WALLET</Text>
						<Wrapper>
							<View style={styles.wrapperImage}>
								<Image source={require('src/assets/payment/gopay.png')} style={styles.imagePayment} name="Gopay" />
							</View>
							<View style={styles.wrapperImage}>
								<Image source={require('src/assets/payment/dana.png')} style={styles.imagePayment} name="Dana" />
							</View>
							<View style={styles.wrapperImage}>
								<Image source={require('src/assets/payment/ovo.png')} style={styles.imagePayment} name="OVO" />
							</View>
						</Wrapper>
					</View>
				</ScrollView>
			</View>
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
														return <Button disabled={index == i} onPress={() => setIndex(i)} color={index == i ? 'primary' : 'white'} width={`${width}%`} style={{ borderRadius: 0 }}>{route.title}</Button>
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
							renderScene={renderScene}
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
	}
})