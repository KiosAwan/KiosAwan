import React from 'react';
import { View, ScrollView } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { GlobalHeaderWithIcon } from '../Header/Header';

const Container = props => {
	const { style } = props
	return <View {...props} style={{ flex: 1, backgroundColor: ColorsList.authBackground, ...style }} >
		{props.header && <GlobalHeaderWithIcon {...props.header} />}
		{props.children}
	</View>
}

const ContainerBody = props => {
	const { style } = props
	return <ScrollView {...props} showsVerticalScrollIndicator={false} style={{ padding: 15, ...style }} />
}

const Body = props => {
	const { style } = props
	return <View {...props} style={{ padding: 15, ...style }} />
}

export default Container
export { ContainerBody, Body }