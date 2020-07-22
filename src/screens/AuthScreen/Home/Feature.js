import styles from './style'
import React from 'react';
import { Wrapper } from 'src/components/View/Wrapper';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { SizeList } from 'src/styles/size';
import { Image } from 'src/components/CustomImage';

const Feature = ({ User, navigation, _featureDisabled }) => {
	const _onPressCashier = () => {
		if (User.data.status == 0) {
			navigation.navigate('/cashier')
		} else {
			_featureDisabled()
		}
	}
	const _onPressPayment = () => {
		if (User.data.status == 1 && User.data.ppob_disabled != 1) {
			navigation.navigate('/ppob')
		} else if (User.data.ppob_disabled == 1) {
			_featureDisabled("ppob-disabled")
		} else {
			_featureDisabled('ppob')
		}
	}
	const _onPressStock = () => _featureDisabled('stock')
	const _onPressHutang = () => _featureDisabled('hutang')
	return <View>
		<Text font="SemiBold" style={{ paddingBottom: SizeList.base }}>Menu Utama</Text>
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