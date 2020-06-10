import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { Image } from 'src/components/CustomImage';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { shadowStyle } from 'src/components/Input/MDInput';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { stateObject } from 'src/utils/state';
import { Body } from 'src/components/View/Container';

const NonTunai = ({ pressImage, style }) => {
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
	const [accordion, setAccordion] = stateObject()
	return <Body>
		{
			nonTunaiList.rMap(({ name, data }, index) => {
				return <View style={{ ...shadowStyle, ...style }} key={index.toString()}>
					<Button color="link" onPress={() => setAccordion({ [index]: !accordion[index] })} spaceBetween>
						<Text font="SemiBold">Pembayaran dengan {name}</Text>
						<Icon color={ColorsList.primary} name={accordion[index] ? "sort-up" : "sort-down"} />
					</Button>
					{
						accordion[index] &&
						<FlatList
							style={{ paddingBottom: SizeList.base }}
							data={data}
							columnWrapperStyle={{ justifyContent: "space-between" }}
							numColumns={2}
							renderItem={({ item }) => {
								return (
									<Button
										width="48%"
										active={item.id == _index ? true : false}
										onPress={() => {
											setIndex(item.id)
											pressImage(item.id)
										}}
										style={{ marginTop: SizeList.padding, borderRadius: 5 }}
										padding={10}
										color={['transparent', 'greyFont', 'greyAuthHard']}
										activeColor={['transparent', 'greyFont', 'primary']}
										flexStart>
										<Image style={{ width: "100%", height: 30 }} source={item.image} />
									</Button>
								)
							}}
						/>
					}
				</View>
			})
		}
	</Body>
}

export default NonTunai;