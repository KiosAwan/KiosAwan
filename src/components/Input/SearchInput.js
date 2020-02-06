import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from "react-native-animatable";
import { FontList, FontName } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';
import Divider from '../Row/Divider';
import { Wrapper } from '../View/Wrapper';
import { $Border } from 'src/utils/stylehelper';
import MDInput from './MDInput';
import { Button } from '../Button/Button';

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
						style: [{ color: props.color || ColorsList.primary, padding: 0 }, props.style]
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
		<Divider style={{ marginTop: 5 }} color={isFocused ? props.color || ColorsList.primary : props.blurColor || ColorsList.greyAuthHard} />
	</View>
}

const InputClear = props => {
	return <SearchInput noSearch {...props} />
}

const SearchInputV2 = props => {
	const [visible, setVisible] = useState({
		left: true,
		right: true
	})
	const { onPressLeft, onPressRight, focusLeft, focusRight } = props
	const left = () => {
		const btn = <Button color="link" onPress={onPressLeft} disabled={!onPressLeft}>
			<Icon _width="10%" size={15} style={{ color: ColorsList.primary }} name="search" />
		</Button>
		if (focusLeft) {
			if (visible.left) {
				return btn
			} else {
				return null
			}
		}
		return btn
	}
	const right = () => {
		const btn = <Button color="link" onPress={onPressRight} disabled={!onPressRight}>
			<Image style={{ width: 20, height: 20 }} source={require('src/assets/icons/circlereject.png')} />
		</Button>
		if (focusRight) {
			if (visible.right) {
				return btn
			} else {
				return null
			}
		}
		return btn
	}
	const focus = () => setVisible({ left: true, right: true })
	const blur = () => setVisible({ left: false, right: false })
	useEffect(() => {
		if (focusLeft) setVisible({ ...visible, left: false })
		if (focusRight) setVisible({ ...visible, right: false })
	}, [])
	return <MDInput
		renderLeftAccessory={left}
		renderRightAccessory={right}
		onFocus={focus}
		onBlur={blur}
		{...props}
	/>
}

export default SearchInput
export { InputClear, SearchInputV2 }

const styles = StyleSheet.create({
	searchWrapper: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: 'space-around'
	},
	textInput: {
		textDecorationLine: 'none',
		fontFamily: FontName.Regular,
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