import React, { Component, useEffect, useState } from 'react';
import BarStatus from 'src/components/BarStatus';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { ColorsList } from 'src/styles/colors';
import NetInfo from '@react-native-community/netinfo';
import { Bottom } from 'src/components/View/Bottom';
import { ImageAuto, Image } from 'src/components/CustomImage';

const NotConnected = ({ navigation }) => {
	const [loading, setLoading] = useState(false)
	const navigate = (path, params) => {
		NetInfo.fetch().then(state => {
			setTimeout(() => {
				setLoading(false)
				if (state.isInternetReachable) {
					navigation.navigate(path, params)
				}
			}, 500)
		});
	}
	const goBack = () => {
		setLoading(true)
		try {
			let { routeName, params } = nextScene.route
			navigate(routeName, params)
		} catch (err) {
			navigate('/splashscreen')
		}
	}
	return <View style={{ flex: 1, alignItems: 'center', backgroundColor: ColorsList.authBackground, justifyContent: 'center' }}>
		<BarStatus />
		<View style={{ padding: 15 }}>
			<Image align="center" size={200} source={require('src/assets/images/not-connected.png')} />
			<Text align="center" size={20} font="ExtraBold">Internet tidak tersedia</Text>
			<Text align="center" style={{ marginBottom: 15 }}>Mohon hubungkan ke jaringan internet untuk memulai kembali</Text>
		</View>
		<Bottom>
			<Button width="100%" disabled={loading} wrapper={{ justify: 'center' }} onPress={goBack} >
				<Text color="whiteColor">Coba Lagi</Text>
				{loading ? <ActivityIndicator style={{ marginLeft: 5 }} color={ColorsList.whiteColor} /> : <View></View>}
			</Button>
		</Bottom>
	</View>
}
export default NotConnected