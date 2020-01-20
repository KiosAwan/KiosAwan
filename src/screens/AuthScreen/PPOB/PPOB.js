import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import Icon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient';
import BarStatus from 'src/components/BarStatus';
import { useSelector } from 'react-redux';
import { convertRupiah } from 'src/utils/authhelper';
import { ColorsList } from 'src/styles/colors';
import { CardIcon } from 'src/components/Card/CardIcon';

const PPOB = ({ navigation }) => {
	const User = useSelector(state => state.User)

	const productData = [
		{ icon: require('src/assets/icons/ppob/Asuransi.png'), name: "Asuransi" },
		{ icon: require('src/assets/icons/ppob/BPJS.png'), name: "BPJS" },
		{ icon: require('src/assets/icons/ppob/E-Money.png'), name: "E - Money" },
		{ icon: require('src/assets/icons/ppob/Games.png'), name: "Games" },
		{ icon: require('src/assets/icons/ppob/Kredit.png'), name: "Kredit" },
		{ icon: require('src/assets/icons/ppob/Paket-data.png'), name: "Paket data" },
		{ icon: require('src/assets/icons/ppob/PDAM.png'), name: "PDAM" },
		{ icon: require('src/assets/icons/ppob/PLN.png'), name: "PLN" },
		{ icon: require('src/assets/icons/ppob/pulsa.png'), name: "Pulsa" },
		{ icon: require('src/assets/icons/ppob/Telkom.png'), name: "Telkom" },
		{ icon: require('src/assets/icons/ppob/TV-Kabel.png'), name: "TV Kabel" },
		{ icon: require('src/assets/icons/ppob/Zakat.png'), name: "Zakat" },
	]
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={{ height: 170 }}>
				<BarStatus />
				<Wrapper justify="space-between" style={{ padding: 15, paddingTop: 5 }}>
					<View style={{ justifyContent: 'center' }}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Icon color="white" size={20} name="arrow-left" />
						</TouchableOpacity>
					</View>
					<Text color="whiteColor">PAYMENT POINT</Text>
					<View style={{ justifyContent: 'center' }}>
						<TouchableOpacity>
							<Icon color="white" size={20} name="ellipsis-v" />
						</TouchableOpacity>
					</View>
				</Wrapper>
				<View style={styles.wrapSaldoInfo}>
					<Text color="whiteColor">Saldo Kios Awan</Text>
					<Text size={32} color="whiteColor">{convertRupiah(User.data.saldo)}</Text>
				</View>
			</LinearGradient>
			{/* {List Data} */}
			<FlatList
				style={{ flex: 1, margin: 10 }}
				showsVerticalScrollIndicator={false}
				data={productData}
				numColumns={3}
				renderItem={({ item }) => (
					<View style={{ flex: 1, alignItems: "center", marginVertical: 10 }}>
						<CardIcon
							icon={item.icon}
							name={item.name}
						/>
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		</View>
	)
}
export default PPOB

const styles = StyleSheet.create({
	wrapSaldoInfo: {
		padding: 20
	}
})