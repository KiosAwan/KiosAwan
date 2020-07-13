import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5'
import BarStatus from 'src/components/BarStatus';
import { Wrapper } from 'src/components/View/Wrapper';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Image } from 'src/components/CustomImage';
import { convertRupiah } from 'src/utils/authhelper';
import { Button } from 'src/components/Button/Button';
import { $Padding } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import AsyncStorage from 'src/utils/async-storage';

const Header = ({ User, navigation, _featureDisabled, _handleRefresh }) => {
	const _onPressTopUp = async () => {
		// if (User.data.status == 1) {
		// 	navigation.navigate('/ppob/topup')
		// } else {
		// 	_featureDisabled("topup")
		// }
		await AsyncStorage.put("_featureDisabled", true)
		_featureDisabled("FITUR TOP UP")
	}
	const _onPressRiwayat = async () => {
		// if (User.data.status == 1) {
		// 	navigation.navigate('/ppob/riwayat')
		// } else {
		// 	_featureDisabled("riwayat")
		// }
		await AsyncStorage.put("_featureDisabled", true)
		_featureDisabled("FITUR RIWAYAT KEUANGAN")
	}
	return <View>
		<View style={{ justifyContent: "center" }}>
			<BarStatus />
			<Wrapper justify="space-between">
				<View>
					<Text align="left">Halo,</Text>
					<Text align="left" font="SemiBold" size={16}>{User && User.data.name && User.data.name.toUpperCase()}</Text>
				</View>
				<View style={{ justifyContent: 'center' }}>
					<TouchableOpacity onPress={_onPressRiwayat}>
						<View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: ColorsList.primary, position: "absolute", right: 0, top: 0 }} />
						<Icon color="grey" size={20} name="bell" />
					</TouchableOpacity>
				</View>
			</Wrapper>
		</View>
		<Wrapper justify="space-between" style={$Padding(10, 0)}>
			<View>
				<Text>Saldo anda sebesar: </Text>
				<Wrapper spaceBetween>
					<Text color="primary" font="SemiBold">{convertRupiah(User.data.saldo || 0)}</Text>
					<TouchableOpacity onPress={_handleRefresh}>
						<Image source={require('src/assets/icons/home/refresh.png')} size={15} style={{ marginLeft: 10 }} />
					</TouchableOpacity>
				</Wrapper>
			</View>
			<Button width={100} onPress={_onPressTopUp}>TOP UP</Button>
		</Wrapper>
	</View>
}

export default Header