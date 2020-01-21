import React, { Component, useEffect, useState } from 'react';
import BarStatus from 'src/components/BarStatus';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { ColorsList } from 'src/styles/colors';
import NetInfo from '@react-native-community/netinfo';

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
		if (nextScene && Object.keys(nextScene).includes('route')) {
			let { routeName, params } = nextScene.route
			navigate(routeName, params)
		} else {
			navigate('/splashscreen')
		}
	}
	return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		<BarStatus />
		<Text align="center" style={{ marginBottom: 15 }}>Anda tidak terhubung ke jaringan internet, silahkan periksa koneksi</Text>
		<Button disabled={loading} wrapper={{ justify: 'center' }} onPress={goBack} width="50%" >
			<Text color="whiteColor">Coba Lagi</Text>
			{loading ? <ActivityIndicator style={{ marginLeft: 5 }} color={ColorsList.whiteColor} /> : <View></View>}
		</Button>
	</View>
}
export default NotConnected