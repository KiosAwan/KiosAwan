import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { GlobalHeader } from '../../components/Header/Header'
import { ColorsList } from 'src/styles/colors';
import Axios from 'axios';
import { HOST_URL } from 'src/config';
import { Text } from 'src/components/Text/CustomText';
import HTML from 'react-native-render-html';
import { FontList } from 'src/styles/typography';
import { SizeList } from 'src/styles/size';
const TermCondition = ({ navigation }) => {

	const [content, setContent] = useState()
	useEffect(() => {
		_getContent()
	}, [])

	const _getContent = async () => {
		const res = await Axios.get(`${HOST_URL}/term_conditions`)
		setContent(res.data.data)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader
				onPressBack={() => navigation.goBack()}
				title="Syarat dan Ketentuan"
			/>
			<View style={styles.container}>
				<FlatList
					data={content}
					renderItem={({ item }) => (
						<View style={{ padding: 10 }}>
							{item.id == 0 ? null :
								<View style={styles.categoryView}>
									<View style={styles.categoryCircle}>
										<Text color="primary">{item.id}</Text>
									</View>
									<Text color="primary">{item.title}</Text>
								</View>
							}
							<View style={styles.partView}>
								<View style={styles.line} />
								<View style={{ width: '90%', marginLeft: 5 }}>
									<HTML
										tagsStyles={{
											p: { fontFamily: FontList.primaryFont, color: ColorsList.greySoft },
										}}
										html={item.name}
									/>
								</View>
							</View>
						</View>
					)}
				/>
			</View>
		</View>
	)
}

export default TermCondition

const styles = StyleSheet.create({
	container: {
		padding: SizeList.bodyPadding,
		flex: 1
	},
	line: {
		width: 1,
		height: '100%',
		backgroundColor: ColorsList.primary,
		marginHorizontal: 10
	},
	partView: {
		flexDirection: 'row',
		alignItems: "center",
	},
	categoryView: {
		marginVertical: 10,
		flexDirection: 'row',
		alignSelf: "flex-start",
		justifyContent: "center"
	},
	categoryCircle: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: ColorsList.primary,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 5
	},
})