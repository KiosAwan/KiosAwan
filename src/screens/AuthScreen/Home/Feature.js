import styles from './style'
import React from 'react';
import { Wrapper } from 'src/components/View/Wrapper';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { SizeList } from 'src/styles/size';
import { Image } from 'src/components/CustomImage';
import AsyncStorage from 'src/utils/async-storage';

const Feature = ({ User, navigation, _featureDisabled }) => {
	const _onPressCashier = () => {
		if (User.data.status == 1) {
			navigation.navigate('/cashier')
		} else {
			_featureDisabled('cashier')
		}
	}
	const _onPressPayment = async () => {
		// if (User.data.status == 1) {
		// 	navigation.navigate('/ppob')
		// } else {
		// _featureDisabled('ppob')
		await AsyncStorage.put("_featureDisabled", true)
		_featureDisabled('FITUR PAYMENT POINT')
		// }
	}
	const _onPressStock = async () => {
		await AsyncStorage.put('_featureDisabled', true)
		_featureDisabled('stock')
	}
	const _onPressHutang = async () => {
		await AsyncStorage.put('_featureDisabled', true)
		_featureDisabled('hutang')
	}
	return <View>
		<Text font="SemiBold" style={{ paddingBottom: SizeList.base }}>Quick Actions</Text>
		<TouchableOpacity onPress={_onPressCashier}>
			<Wrapper spaceBetween shadow style={styles.cardWrapper}>
				<Image size={50} style={{ resizeMode: 'contain' }} _width="20%" source={require("src/assets/icons/home/kasir.png")} />
				<View _width="80%">
					<Text font="SemiBold" color="primary">KASIR</Text>
					<Text>Masuk kedalam mode kasir dan atur penjualan kios atau warung</Text>
				</View>
			</Wrapper>
		</TouchableOpacity>
		<TouchableOpacity onPress={_onPressPayment}>
			<Wrapper spaceBetween shadow style={styles.cardWrapper}>
				<Image size={50} style={{ resizeMode: 'contain' }} _width="20%" source={require("src/assets/icons//home/ppob.png")} />
				<View _width="80%">
					<Text font="SemiBold" color="primary">PEMBAYARAN (PPOB)</Text>
					<Text>Lakukan pembayaran tagihan listrik, PDAM, pulsa, paket data, dll</Text>
				</View>
			</Wrapper>
		</TouchableOpacity>
		<TouchableOpacity onPress={_onPressStock}>
			<Wrapper spaceBetween shadow style={styles.cardWrapper}>
				<Image size={50} style={{ resizeMode: 'contain' }} _width="20%" source={require("src/assets/icons/home/restock.png")} />
				<View _width="80%">
					<Text font="SemiBold" color="primary">BELANJA STOK</Text>
					<Text>Dapatkan berbagai macam produk untuk kebutuhan kios atau warung</Text>
				</View>
			</Wrapper>
		</TouchableOpacity>
		<TouchableOpacity onPress={_onPressHutang}>
			<Wrapper spaceBetween shadow style={[styles.cardWrapper, { marginBottom: 0 }]}>
				<Image size={50} style={{ resizeMode: 'contain' }} _width="20%" source={require("src/assets/icons/home/hutang.png")} />
				<View _width="80%">
					<Text font="SemiBold" color="primary">PENCATATAN HUTANG</Text>
					<Text>Kelola hutang dan piutang usaha kios atau warung</Text>
				</View>
			</Wrapper>
		</TouchableOpacity>
	</View>
}

export default Feature