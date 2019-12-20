import React, { useState } from 'react';

import { View, StyleSheet, TextInput } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Button, Wrapper, Bottom } from 'src/components/Button/ButtonComp';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text } from 'src/components/Text/CustomText';
import { ImageText } from 'src/components/Card/CardComp';
import { TouchableOpacity } from 'react-native-gesture-handler';

const initialLayout = { width: 300, height: 300 };

const TransactionDetailLunasi = ({ navigation }) => {

	const Tunai = props => {
		const [filterPopup, setFilterPopup] = useState(false)
		return (
			<View style={{ padding: 15, flex: 1 }}>
				<View style={{ padding: 20, backgroundColor: ColorsList.whiteColor }}>
					<Text color="primary">Uang yang diterima</Text>
					<TextInput value="Rp. 50.000" style={{ borderBottomColor: ColorsList.primary, borderBottomWidth: 1, marginBottom: 10 }} />
					<Text color="primary">Kembalian: Rp. 50.000</Text>
					<Wrapper style={{ marginTop: 20 }}>
						<Button width="48%">Uang Pas</Button>
						<Button width="48%">Rp. 100.000</Button>
					</Wrapper>
				</View>
			</View>
		)
	}

	const NonTunai = props => {
		return (
			<View style={{ padding: 15, flex: 1 }}>
				<View style={{ backgroundColor: ColorsList.whiteColor, padding: 20 }}>
					<Text size={17} font="ExtraBold" style={{ marginVertical: 15, borderBottomColor: ColorsList.greyAuthHard, borderBottomWidth: 1, textAlign: 'center' }}>DEBIT</Text>
					<Wrapper>
						<ImageText size={150} name="BCA" />
						<ImageText size={150} name="Mandiri" />
						<ImageText size={150} name="BRI" />
					</Wrapper>
					<Text size={17} font="ExtraBold" style={{ marginVertical: 15, borderBottomColor: ColorsList.greyAuthHard, borderBottomWidth: 1, textAlign: 'center' }}>E-WALLET</Text>
					<Wrapper>
						<ImageText size={150} name="Gopay" />
						<ImageText size={150} name="Dana" />
						<ImageText size={150} name="OVO" />
					</Wrapper>
				</View>
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
			<GlobalHeader onPressBack={() => navigation.navigate('/drawer/transaction')} title="Lunasi" />
			<View style={{ flex: 1 }}>
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
								<View style={{ padding: 15 }}>
									<Wrapper justify="space-between" style={{ marginBottom: 5, padding: 20, backgroundColor: ColorsList.whiteColor }}>
										<Wrapper direction="column">
											<Text font="Bold">Total Tagihan</Text>
											<Text color="primary" font="ExtraBold" size={30}>Rp. 50.000</Text>
										</Wrapper>
										<View style={{ justifyContent: 'flex-end' }}>
											<TouchableOpacity onPress={() => setViewDetail(!viewDetail)}>
												<Text font="Bold" size={18}>DETAIL</Text>
											</TouchableOpacity>
										</View>
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
				<Button width="100%">Terima Rp. 50.000</Button>
			</Bottom>
		</View>
	);
}

export default TransactionDetailLunasi

const styles = StyleSheet.create({
	containerEmptyData: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	containerWithData: {
		flex: 1
	}
})