import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { $Padding, $BorderRadius } from 'src/utils/stylehelper';
import { Wrapper } from 'src/components/View/Wrapper';
import Axios from 'src/utils/axios';
import { HOST_URL } from 'src/config';
import SearchInput, { SearchInputV2 } from 'src/components/Input/SearchInput';
import { Body } from 'src/components/View/Container';
import Divider from 'src/components/Row/Divider';
import { SizeList } from 'src/styles/size';
const FAQ = ({ navigation }) => {
	const [search, setSearch] = useState('')
	const [toggled, setToggled] = useState({})
	const [Faqs, setFaqs] = useState([])

	const getFaqs = async () => {
		let { data } = await Axios.get(`${HOST_URL}/faqs`)
		setFaqs(data.data)
	}

	useEffect(() => {
		getFaqs()
	}, [])
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="FAQ" onPressBack={() => navigation.goBack()} />
			{/* <View style={{ ...$Padding(5, 15, 15, 15), backgroundColor: ColorsList.whiteColor }}> */}

			<View style={{ paddingHorizontal: SizeList.bodyPadding }}>
				<SearchInputV2
					search={search}
					placeholder="Cari jawaban"
					handleChangeInput={text => setSearch(text)}
				/>
			</View>
			{/* </View> */}
			<Body>
				<View style={{ padding: 15, backgroundColor: ColorsList.whiteColor }}>
					{
						Faqs.filter(faq => faq.question.toLowerCase().includes(search.toLowerCase())).rMap((faq, i) => {
							return [<TouchableOpacity key={i} activeOpacity={.9} onPress={() => { setToggled({ ...toggled, [`${i}`]: !toggled[i] }); console.debug(toggled[i]); }}>
								<Wrapper justify="space-between" style={[styles.content, toggled[i] ? styles.contentToggled : styles.contentNotToggled]}>
									<Text _width="85%" font="SemiBold">{faq.question}</Text>
									<Text _width="10%" style={{ alignSelf: "flex-end" }} color="primary" size={20}>{toggled[i] ? '-' : '+'}</Text>
								</Wrapper>
							</TouchableOpacity>,
							toggled[i] ?
								<View style={[styles.subContent]}>
									<Text>{faq.answer}</Text>
								</View>
								: null,
							i != Faqs.length - 1 && <Divider style={{ marginVertical: SizeList.secondary }} />
							]
						})
					}
				</View>
			</Body>
		</View>
	)
}
export default FAQ

const styles = StyleSheet.create({
	content: { ...$BorderRadius(5) },
	contentToggled: {},
	subContent: {
		padding: SizeList.base,
		paddingTop: 0
	}
})