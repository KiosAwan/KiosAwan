import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { ColorsList } from 'src/styles/colors';

const Container = props => {
	const { style } = props
	return <View {...props} style={{ flex: 1, backgroundColor: ColorsList.authBackground, ...style }} />
}

const ContainerBody = props => {
	const { style } = props
	return <ScrollView {...props} style={{ padding: 15, ...style }} />
}

export default Container
export { ContainerBody }