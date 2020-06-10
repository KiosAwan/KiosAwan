import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { GlobalHeaderWithIcon } from '../Header/Header';
import BarStatus from '../BarStatus';
import { SizeList } from 'src/styles/size';

const Container = props => {
	const { padding, style, onlyTitle, justify } = props
	return <View {...props} style={{
		flex: 1,
		backgroundColor: ColorsList.authBackground,
		...padding && { padding: SizeList.bodyPadding },
		...style,
		...justify && { justifyContent: justify }
	}}>
		<BarStatus />
		{props.header && <GlobalHeaderWithIcon onlyTitle={onlyTitle} {...props.header} />}
		{props.children}
	</View>
}

const Body = props => {
	const { style } = props
	return <ScrollView {...props} showsVerticalScrollIndicator={false}>
		<View style={{ padding: SizeList.bodyPadding, ...style }}>{props.children}</View>
	</ScrollView>
}

const BodyFlatList = props => <FlatList {...props} style={{ padding: SizeList.bodyPadding, ...props.style }} />

const Footer = props => {
	const { style, noPadding } = props
	return <View {...props} style={{
		...!noPadding && { paddingHorizontal: SizeList.bodyPadding, marginBottom : SizeList.bodyPadding },
		...style
	}} />
}

export default Container
export { Body, BodyFlatList, Footer }