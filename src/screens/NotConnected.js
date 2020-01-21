import React, { Component, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { Button } from 'src/components/Button/Button';

const NotConnected = ({ navigation }) => {
	const goBack = () => {
		let { routeName, params } = nextScene.route
		navigation.navigate(routeName, params)
	}
	return <View>
		<Text align="center">Internet anda sampah</Text>
		<Button onPress={goBack}>Coba Lagi</Button>
	</View>
}
export default NotConnected