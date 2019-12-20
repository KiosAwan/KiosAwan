import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { Wrapper, Button } from 'src/components/Button/ButtonComp';
import { ColorsList } from 'src/styles/colors';
import { ImageText } from 'src/components/Card/CardComp';
import moment from 'moment';
import { Icon } from 'native-base';
import { FloatingInput } from 'src/components/Input/InputComp';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const TransactionDetailHutang = ({ navigation }) => {
	const [filterPopup, setFilterPopup] = useState(false)

	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader onPressBack={() => navigation.goBack()} title="Daftar Hutang" />
			<AwanPopup.Menu visible={filterPopup} title="FILTER" backdropDismiss={() => setFilterPopup(false)}>
				<TouchableOpacity>
					<Text>Semua</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text>Lunas</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text>Hutang</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text>Dibatalkan</Text>
				</TouchableOpacity>
			</AwanPopup.Menu>

			<Wrapper justify="space-between" style={{ backgroundColor: ColorsList.whiteColor, padding: 15 }}>
				<FloatingInput labelStyle={{ paddingLeft: 30 }} style={{ width: "80%" }} label="Cari produk">
					<Icon style={{ color: ColorsList.primary }} name="search" />
					<TextInput style={{ width: '90%' }} value="" />
				</FloatingInput>
				<Button onPress={() => setFilterPopup(true)}>
					<Image style={{ width: 30, height: 30 }} source={require('src/assets/icons/filter.png')} />
				</Button>
			</Wrapper>
			<View style={{ flex: 1, padding: 15 }}>
				<Wrapper style={styles.wrapper} justify="space-between">
					<Wrapper>
						<ImageText size={100} name="Udin Marudin" />
						<View style={[styles.centering, { paddingLeft: 15 }]}>
							<Text font="ExtraBold" color="primary">Udin Marudin</Text>
							<Text>{moment().format('ddd, DD MMM YYYY')}</Text>
						</View>
					</Wrapper>
					<View style={styles.centering}>
						<Icon name="alert" style={{ alignSelf: 'flex-end', color: ColorsList.warning }} />
						<Text font="ExtraBold" color="primary">Rp. 350.000</Text>
					</View>
				</Wrapper>
			</View>
		</View >
	)
}

export default TransactionDetailHutang

const styles = StyleSheet.create({
	wrapper: { padding: 15, backgroundColor: ColorsList.whiteColor, marginBottom: 5 },
	centering: { justifyContent: 'center' }
})