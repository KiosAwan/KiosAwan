import React, { Component, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { FloatingInput } from 'src/components/Input/InputComp';
import { ColorsList } from 'src/styles/colors';
import { Icon } from 'native-base';
import { $Padding, $BorderRadius } from 'src/utils/stylehelper';
import { Wrapper } from 'src/components/View/Wrapper';
const FAQ = ({ navigation }) => {
	const [search, setSearch] = useState('')
	const [activeColor, setActiveColor] = useState(ColorsList.greyFont)
	const [toggled, setToggled] = useState({})
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="FAQ" onPressBack={() => navigation.goBack()} />
			<View style={{ ...$Padding(5, 15, 15, 15), backgroundColor: ColorsList.whiteColor }}>
				<FloatingInput left={30} _wrapper={{ justify: 'flex-start' }} label="Cari jawaban">
					<Icon name="search" style={{ color: activeColor, marginRight: 10 }} />
					<TextInput value={search} onFocus={() => setActiveColor(ColorsList.primary)} onBlur={() => setActiveColor(ColorsList.greyFont)} onChangeText={text => setSearch(text)} />
				</FloatingInput>
			</View>
			<View style={{ padding: 15 }}>
				{
					[1, 2, 3, 4, 5].map((a, i) => {
						return [<TouchableOpacity key={i} style={{ marginTop: i == 0 ? 0 : 10 }} activeOpacity={.9} onPress={() => { setToggled({ ...toggled, [`${i}`]: !toggled[i] });console.debug(toggled[i]); }}>
							<Wrapper justify="space-between" style={[styles.content, toggled[i] ? styles.contentToggled : styles.contentNotToggled]}>
								<Text color={toggled[i] ? 'whiteColor' : 'greyFont'}>Lorem</Text>
								<Text color={toggled[i] ? 'whiteColor' : 'primary'} size={20}>{toggled[i] ? '-' : '+'}</Text>
							</Wrapper>
						</TouchableOpacity>,
						toggled[i] ?
							<View style={[styles.content, $BorderRadius(0, 0, 5, 5)]}>
								<Text>Sint dolore dolor do ex proident enim in aute mollit sint aliquip.</Text>
							</View>
							: null
						]
					})
				}
			</View>
		</View>
	)
}
export default FAQ

const styles = StyleSheet.create({
	content: { ...$Padding(5, 15), ...$BorderRadius(5), backgroundColor: ColorsList.whiteColor },
	contentToggled: { backgroundColor: ColorsList.primary, ...$BorderRadius(5, 5, 0, 0) }
})