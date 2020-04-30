import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { $Padding, $BorderRadius } from 'src/utils/stylehelper';
import { Wrapper } from 'src/components/View/Wrapper';
import Axios from 'axios';
import { HOST_URL } from 'src/config';
import SearchInput from 'src/components/Input/SearchInput';
import { Body } from 'src/components/View/Container';
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
			<View style={{ ...$Padding(5, 15, 15, 15), backgroundColor: ColorsList.whiteColor }}>
				<SearchInput handleDeleteSearch={() => setSearch('')} search={search} placeholder="Cari jawaban" handleChangeInput={text => setSearch(text)} />
			</View>
			<Body>
				{/* <View style={{ padding: 15 }}> */}
					{
						Faqs.filter(faq => faq.question.toLowerCase().includes(search.toLowerCase())).map((faq, i) => {
							return [<TouchableOpacity key={i} style={{ marginTop: i == 0 ? 0 : 10 }} activeOpacity={.9} onPress={() => { setToggled({ ...toggled, [`${i}`]: !toggled[i] }); console.debug(toggled[i]); }}>
								<Wrapper justify="space-between" style={[styles.content, toggled[i] ? styles.contentToggled : styles.contentNotToggled]}>
									<Text color={toggled[i] ? 'whiteColor' : 'greyFont'}>{faq.question}</Text>
									<Text color={toggled[i] ? 'whiteColor' : 'primary'} size={20}>{toggled[i] ? '-' : '+'}</Text>
								</Wrapper>
							</TouchableOpacity>,
							toggled[i] ?
								<View style={[styles.content, $BorderRadius(0, 0, 5, 5)]}>
									<Text>{faq.answer}</Text>
								</View>
								: null
							]
						})
					}
				{/* </View> */}
			</Body>
		</View>
	)
}
export default FAQ

const styles = StyleSheet.create({
	content: { ...$Padding(5, 15), ...$BorderRadius(5), backgroundColor: ColorsList.whiteColor },
	contentToggled: { backgroundColor: ColorsList.primary, ...$BorderRadius(5, 5, 0, 0) }
})