import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import { RowChild } from '../../../../components/Helper/RowChild';
import { TouchableImage } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { Wrapper } from 'src/components/View/Wrapper';
import { ImageAuto } from 'src/components/CustomImage';

const NonTunai = (props) => {
	const [index, setIndex] = useState()
	const pressCard = (i) => {
		setIndex(i)
		props.pressImage(i)
	}
	return (
		<ScrollView style={styles.container}>
			<View style={{ backgroundColor: ColorsList.whiteColor, padding: 20, paddingTop: 0 }}>
				<Text style={styles.text}>DEBIT</Text>
				<Wrapper>
					<TouchableOpacity style={[styles.wrapperImage, index == 1 ? styles.selectedNonTunai : null]} onPress={() => pressCard(1)}>
						<ImageAuto source={require('src/assets/payment/bca.png')} name="BCA" />
					</TouchableOpacity>
					<TouchableOpacity style={[styles.wrapperImage, index == 2 ? styles.selectedNonTunai : null]} onPress={() => pressCard(2)}>
						<ImageAuto source={require('src/assets/payment/mandiri.png')} name="Mandiri" />
					</TouchableOpacity>
					<TouchableOpacity style={[styles.wrapperImage, index == 3 ? styles.selectedNonTunai : null]} onPress={() => pressCard(3)}>
						<ImageAuto source={require('src/assets/payment/bri.png')} name="BRI" />
					</TouchableOpacity>
				</Wrapper>
				<Text style={styles.text}>E-WALLET</Text>
				<Wrapper>
					<TouchableOpacity style={[styles.wrapperImage, index == 4 ? styles.selectedNonTunai : null]} onPress={() => pressCard(4)}>
						<ImageAuto source={require('src/assets/payment/gopay.png')} name="Gopay" />
					</TouchableOpacity>
					<TouchableOpacity style={[styles.wrapperImage, index == 5 ? styles.selectedNonTunai : null]} onPress={() => pressCard(5)}>
						<ImageAuto source={require('src/assets/payment/dana.png')} name="Dana" />
					</TouchableOpacity>
					<TouchableOpacity style={[styles.wrapperImage, index == 6 ? styles.selectedNonTunai : null]} onPress={() => pressCard(6)}>
						<ImageAuto source={require('src/assets/payment/ovo.png')} name="OVO" />
					</TouchableOpacity>
				</Wrapper>
			</View>
		</ScrollView>
	)
}

export default NonTunai;

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		flex: 1
	},
	categoryStyle: {
		...FontList.categoryFontBold,
		color: ColorsList.greyFont
	},
	wrapList: {
		flexDirection: 'row',
		justifyContent: "space-around",
		height: SizeList.height / 6,
		width: SizeList.width - 50,
		padding: 10
	},
	wrapperImage: {
		height: 35,
		width: 80,
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: ColorsList.greyAuthHard
	},
	imagePayment: {
		height: 35,
		width: 80,
		resizeMode: 'contain'
	},
	text: {
		color: ColorsList.greyFont,
		fontSize: 17,
		fontFamily: FontList.boldFont,
		marginVertical: 15,
		borderBottomColor: ColorsList.greySoft,
		borderBottomWidth: 1,
		textAlign: 'center'
	},
	selectedNonTunai: {
		borderWidth: 1,
		borderColor: ColorsList.primary
	}
});