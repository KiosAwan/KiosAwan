import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { RowChild } from 'src/components/Helper/RowChild';
import { TouchableImage } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { Wrapper } from 'src/components/View/Wrapper';
import { ImageAuto, Image } from 'src/components/CustomImage';
import { Text } from 'src/components/Text/CustomText';

const NonTunai = (props) => {
	const [index, setIndex] = useState()
	const pressCard = (i) => {
		setIndex(i)
		props.pressImage(i)
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
			id: 1
		},
		{
			title: "BRI",
			image: require('src/assets/payment/bri.png'),
			id: 1
		},
		{
			title: "BNI",
			image: require('src/assets/payment/bri.png'),
			id: 1
		},
		{
			title: "Gopay",
			image: require('src/assets/payment/gopay.png'),
			id: 1
		},
		{
			title: "DANA",
			image: require('src/assets/payment/dana.png'),
			id: 1
		},
		{
			title: "OVO",
			image: require('src/assets/payment/ovo.png'),
			id: 1
		},
		{
			title: "Link Aja",
			image: require('src/assets/payment/bca.png'),
			id: 1
		}
	]
	return (
		<ScrollView style={styles.container}>
			<View style={{ backgroundColor: ColorsList.whiteColor, padding: 10, paddingTop: 0 }}>
				{nonTunaiList.map((item, i) => (
					<TouchableOpacity style={[styles.card, index == i + 1 ? styles.selectedNonTunai : null]} onPress={() => pressCard(i + 1)}>
						<View style={{ width: 85, height: 30 }}>
							<ImageAuto source={item.image} />
						</View>
						{/* <Text>{item.title}</Text> */}
					{/* <Image source={}/> */}
					</TouchableOpacity>
				))}
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
	card: {
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: ColorsList.greyAuthHard,
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 10
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
		textAlign: 'center',
	},
	selectedNonTunai: {
		borderWidth: 1,
		borderColor: ColorsList.primary
	}
});