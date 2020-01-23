import React, { useState } from 'react'
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { convertRupiah } from 'src/utils/authhelper';
import { FloatingInput, InputCurrency } from 'src/components/Input/InputComp';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Image } from 'src/components/CustomImage';
import Accordion from 'src/components/View/Accordion';
import { Bottom } from 'src/components/View/Bottom';
import { useSelector } from 'react-redux';
import { requestTopUp } from 'src/utils/api/ppobapi';

const Topup = ({ navigation }) => {
	const [topupValue, setTopupValue] = useState(0)
	const [topupMethod, setTopupMethod] = useState()
	const User = useSelector(state => state.User)
	const TopupMethods = [{
		title: 'BCA Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue+3000),
		image: require('src/assets/icons/ppob/topup/BCA.png')
	}, {
		title: 'Mandiri Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue+3000),
		image: require('src/assets/icons/ppob/topup/Mandiri.png')
	}, {
		title: 'BNI Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue+3000),
		image: require('src/assets/icons/ppob/topup/BNI.png')
	}, {
		title: 'BRI Virtual Account',
		subtitle: 'Total pembayaran ' + convertRupiah(topupValue+3000),
		image: require('src/assets/icons/ppob/topup/BRI.png')
	}]
	const _selectTopupMethod = (item, i) => {
		setTopupMethod(i)
	}

	const _pressAddTopUpValue = (value) => {
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
		const data = {
			amount : topupValue,
			id_va :  topupMethod + 1
		}
		const res = await requestTopUp(data)
		navigation.navigate('/ppob/topup/detail', {response : res.data})
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Top Up" onPressBack={() => navigation.goBack()} />
			<ScrollView style={{ padding: 15, marginBottom: 70 }}>
				<Wrapper style={styles.group} justify="space-between">
					<Text>Saldo Kios Awan</Text>
					<Text>{convertRupiah(User.data.saldo)}</Text>
				</Wrapper>
				<View style={[styles.group]}>
					<FloatingInput label="Nominal topup">
						<InputCurrency value={topupValue} onChangeText={text => setTopupValue(text)} />
					</FloatingInput>
					<Text size={10} font="Regular" color="primary">Nominal Kelipatan {convertRupiah(100000)}</Text>
					<FlatList style={{ marginTop: 10 }} data={[100000, 200000, 500000]}
						numColumns={3}
						renderItem={({ item }) => <Button onPress={() => _pressAddTopUpValue(item)} width="31.333%" style={{ marginHorizontal: '1%' }} color="white">{`+ ${convertRupiah(item)}`}</Button>}
						keyExtractor={(item, i) => i.toString()} />
				</View>
				<Text style={{ marginBottom: 10 }} font="Regular" align="center">Metode Pembayaran</Text>
				<Accordion style={[styles.group, { padding: 0 }]} titleColor="primary" button={{disabled: topupValue > 0 ? false : true, color: 'link' }} title={
					<Wrapper justify="flex-start">
						<Image size={25} style={{ marginRight: 10, }} source={require('src/assets/icons/ppob/topup/VirtualAccount.png')} />
						<Text>Virtual Account</Text>
					</Wrapper>
				}>
					<View style={{ paddingVertical: 5, backgroundColor: ColorsList.authBackground }}>
						<FlatList
							data={TopupMethods}
							keyExtractor={(item, i) => i.toString()}
							renderItem={({ item, index }) => index < 4 &&
								<Button onPress={() => _selectTopupMethod(item, index)} style={{ paddingVertical: 5 }} noBorder={!(topupMethod == index)} color="white">
									<Image style={{ resizeMode: 'contain', width: 70, height: 50 }} source={item.image} />
									<View>
										<Text color="primary">{item.title}</Text>
										<Text size={12}>{item.subtitle}</Text>
									</View>
								</Button>
							}
						/>
					</View>
				</Accordion>
				<Accordion style={[styles.group, { padding: 0 }]} titleColor="greyFont" button={{ disabled: true, color: 'link' }} title={
					<Wrapper justify="flex-start">
						<Image size={25} style={{ marginRight: 10, }} source={require('src/assets/icons/ppob/topup/Rekening.png')} />
						<Text>Transfer ke Rekening Bank</Text>
					</Wrapper>
				}>
					<Text>Dolore fugiat labore reprehenderit nulla ea adipisicing velit commodo pariatur. Non est fugiat non proident adipisicing cillum officia culpa fugiat irure. Nisi dolor excepteur eiusmod occaecat proident cillum officia eiusmod elit. Consequat laboris sint ut cillum mollit ex laborum qui irure reprehenderit excepteur. Elit aliquip commodo nulla eiusmod nostrud tempor proident non ea culpa minim ea commodo voluptate. Aliquip nostrud ea officia excepteur ullamco Lorem reprehenderit exercitation veniam. Aliqua reprehenderit consequat laboris aute consectetur elit esse sit.</Text>
				</Accordion>
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