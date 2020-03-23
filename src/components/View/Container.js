import React from 'react';
import { View, ScrollView } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { GlobalHeaderWithIcon } from '../Header/Header';

const Container = props => {
	const { style, onlyTitle } = props
	return <View {...props} style={{ flex: 1, backgroundColor: ColorsList.authBackground, ...style }} >
		{props.header && <GlobalHeaderWithIcon onlyTitle={onlyTitle} {...props.header} />}
		{props.children}
	</View>
}

const Body = props => {
	const { style } = props
	return <ScrollView {...props} showsVerticalScrollIndicator>
		<View style={{ padding: 15, ...style }}>{props.children}</View>
	</ScrollView>
}

const Footer = props => {
	const { style } = props
	return <View {...props} style={{ padding: 15, ...style }} />
}

export default Container
export { Body, Footer }