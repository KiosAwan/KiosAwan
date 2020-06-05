import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { RowChild } from 'src/components/Helper/RowChild';
import { TouchableImage } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { Wrapper } from 'src/components/View/Wrapper';
import { ImageAuto, Image } from 'src/components/CustomImage';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { stateObject } from 'src/utils/state';

const NonTunai = ({ pressImage }) => {
	const [_index, setIndex] = useState()
	const nonTunaiList = [{
		name: 'kartu debit',
		data: [
			{
				title: "Bank BCA",
				image: require('src/assets/payment/bca.png'),
				id: 1
			},
			{
				title: "Bank Mandiri",
				image: require('src/assets/payment/mandiri.png'),
				id: 2
			},
			{
				title: "Bank BRI",
				image: require('src/assets/payment/bri.png'),
				id: 3
			},
			{
				title: "Bank BNI",
				image: require('src/assets/payment/bni.png'),
				id: 4
			}]
	}, {
		name: 'e-wallet',
		data: [
			{
				title: "Gopay",
				image: require('src/assets/payment/gopay.png'),
				id: 5
			},
			{
				title: "DANA",
				image: require('src/assets/payment/dana.png'),
				id: 6
			},
			{
				title: "OVO",
				image: require('src/assets/payment/ovo.png'),
				id: 7
			},
			{
				title: "Link Aja",
				image: require('src/assets/payment/linkaja.png'),
				id: 8
			}
		]
	}]
	return nonTunaiList.rMap(({ name, data }, index) => {
		return <View style={{ marginTop: SizeList.padding }} key={index.toString()}>
			<Text font="SemiBold">Pembayaran dengan {name}</Text>
			<Divider />
			<FlatList
				data={data}
				columnWrapperStyle={{justifyContent : "space-between"}}
				numColumns={2}
				renderItem={({ item }) => {
					return (
						<Button
							width="45%"
							active={item.id == index}
							onPress={() => {
								setIndex(item.id)
								pressImage(item.id)
							}}
							style={{ marginTop: SizeList.padding , borderRadius : 5}}
							padding={10}
							color={['transparent', 'greyFont', 'greyAuthHard']}
							activeColor={['transparent', 'greyFont', 'primary']}
							flexStart>
							<Image style={{ width: "100%", height: 40 }} source={item.image} />
						</Button>
					)
				}}
			/>
		</View>
	})
}

export default NonTunai;