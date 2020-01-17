import React, { Component } from 'react';
import { View } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';

const PPOB = ({ navigation }) => {
	return <View>
		<GlobalHeader title="Payment Point" onPressBack={() => navigation.goBack()} />
	</View>
}
export default PPOB