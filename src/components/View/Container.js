import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { GlobalHeaderWithIcon } from '../Header/Header';

const Container = props => {
	const { style, onlyTitle, justify } = props
	return <View {...props} style={{
		flex: 1,
		backgroundColor: ColorsList.authBackground,
		...style,
		...justify && { justifyContent: justify }
	}} >
		{props.header && <GlobalHeaderWithIcon onlyTitle={onlyTitle} {...props.header} />}
		{props.children}
	</View>
}

const Body = props => {
	const { style } = props
	return <ScrollView {...props} showsVerticalScrollIndicator={false}>
		<View style={{ padding: 15, ...style }}>{props.children}</View>
	</ScrollView>
}

const BodyFlatList = props => <FlatList {...props} style={{ padding: 15, ...props.style }} />

const Footer = props => {
	const { style } = props
	return <View {...props} style={{ padding: 15, ...style }} />
}

export default Container
export { Body, BodyFlatList, Footer }