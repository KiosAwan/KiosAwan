import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from "react-native-animatable";
import { FontList } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';
import Divider from '../Row/Divider';
import { Wrapper } from '../View/Wrapper';
import { $Border } from 'src/utils/stylehelper';

const SearchInput = (props) => {
	const [isFocused, setIsFocused] = useState(false)
	const _onBlur = () => {
		props.onBlur()
		setIsFocused(false)
	}
	const _onFocus = () => {
		props.onFocus()
		setIsFocused(true)
	}
	return <View style={props.style}>
		<Wrapper justify="space-between">
			<Wrapper _width="80%" justify="flex-start">
				{(!props.noSearch && isFocused) ?
					<Icon _width="10%" size={15} style={{ color: props.color || ColorsList.primary }} name="search" />
					: <View />
				}
				{props.children ?
					React.cloneElement(props.children, {
						_width: '80%',
						onBlur: _onBlur,
						onFocus: _onFocus,
						style: [{ color: props.color || ColorsList.primary }, props.style]
					})
					:
					<TextInput
						width="80%"
						onBlur={() => setIsFocused(false)}
						onFocus={() => setIsFocused(true)}
						onChangeText={props.handleChangeInput}
						value={props.search}
						style={styles.textInput}
						placeholder={props.placeholder} />
				}
			</Wrapper>
			<Animatable.View duration={500} animation={isFocused ? "slideInRight" : 'bounceOutRight'}>
				<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={props.clear || props.handleDeleteSearch}>
					<Image style={{ width: 20, height: 20 }} source={props.icon || require('src/assets/icons/circlereject.png')} />
				</TouchableOpacity>
			</Animatable.View>
		</Wrapper>
		<Divider color={isFocused ? props.color || ColorsList.primary : props.blurColor || ColorsList.greyAuthHard} />
	</View>
}

const InputClear = props => {
	return <SearchInput noSearch {...props} />
}

export default SearchInput
export { InputClear }

const styles = StyleSheet.create({
	searchWrapper: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: 'space-around'
	},
	textInput: {
		fontWeight: '500',
		textDecorationLine: 'none',
		fontFamily: FontList.regularFont,
		color: ColorsList.primary
	},
	deleteIcon: {
		backgroundColor: 'blue',
		width: '10%',
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 7
	}
})