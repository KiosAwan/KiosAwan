import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../Text/CustomText';
import { SizeList } from 'src/styles/size';
import { Wrapper } from './Wrapper';
import { IconHeader } from '../Header/Header';
import Divider from '../Row/Divider';
import { Icon } from 'native-base';
import { ColorsList } from 'src/styles/colors';

const ButtonCart = props => {
	const { quantity, price, onPress } = props
	return <View style={{ bottom: 0, position: 'absolute', width: '100%' }}>
		<TouchableOpacity onPress={onPress}>
			<View style={{ borderRadius: 50, paddingHorizontal: SizeList.base * 2, paddingVertical: SizeList.secondary, marginHorizontal: SizeList.base, backgroundColor: ColorsList.primary }}>
				<Wrapper spaceBetween>
					<Wrapper>
						<Icon name="ios-cart" style={{ color: ColorsList.white, marginRight: SizeList.secondary }} />
						<Text color="white">BELANJA {quantity || 0} PRODUK</Text>
					</Wrapper>
					{/* <Divider flex /> */}
					<View style={{ justifyContent: 'center' }}>
						<Text color="white">{price || '0'.convertRupiah()}</Text>
					</View>
				</Wrapper>
			</View>
		</TouchableOpacity>
	</View>
}

export default ButtonCart