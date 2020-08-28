import React, { useState } from "react"
import {
	View,
	TextInput,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native"

import Icon from "react-native-vector-icons/FontAwesome5"
import * as Animatable from "react-native-animatable"
import { FontName } from "../../styles/typography"
import { ColorsList } from "../../styles/colors"
import Divider from "../Row/Divider"
import { Wrapper } from "../View/Wrapper"
import { Input } from "./MDInput"

const SearchInput = props => {
	let nullFn = () => {}
	const [isFocused, setIsFocused] = useState(false)
	const onFocus = props.onFocus || nullFn
	const onBlur = props.onBlur || nullFn
	const _onBlur = () => {
		onBlur()
		setIsFocused(false)
	}
	const _onFocus = () => {
		onFocus()
		setIsFocused(true)
	}
	return (
		<View style={props.style}>
			<Wrapper justify="space-between">
				<Wrapper _width="80%" justify="flex-start">
					{!props.noSearch && isFocused ? (
						<Icon
							_width="10%"
							size={15}
							style={{ color: props.color || ColorsList.primary }}
							name="search"
						/>
					) : (
						<View />
					)}
					{props.children ? (
						React.cloneElement(props.children, {
							_width: "80%",
							onBlur: _onBlur,
							onFocus: _onFocus,
							style: [
								{ color: props.color || ColorsList.primary, padding: 0 },
								props.style,
							],
						})
					) : (
						<TextInput
							width="80%"
							onBlur={() => setIsFocused(false)}
							onFocus={() => setIsFocused(true)}
							onChangeText={props.handleChangeInput}
							value={props.search}
							style={[
								styles.textInput,
								props.textInput && props.textInput.style,
							]}
							placeholder={props.placeholder}
							{...props.textInput}
						/>
					)}
				</Wrapper>
				<Animatable.View
					duration={500}
					animation={isFocused ? "slideInRight" : "bounceOutRight"}>
					<TouchableOpacity
						style={{ flexDirection: "row", justifyContent: "flex-end" }}
						onPress={props.clear || props.handleDeleteSearch}>
						<Image
							style={{ width: 20, height: 20 }}
							source={
								props.icon || require("src/assets/icons/circlereject.png")
							}
						/>
					</TouchableOpacity>
				</Animatable.View>
			</Wrapper>
			<Divider
				style={{ marginTop: 5 }}
				color={
					isFocused
						? props.color || ColorsList.primary
						: props.blurColor || ColorsList.greyAuthHard
				}
			/>
		</View>
	)
}
const SearchInputV2 = _props => {
	const { handleChangeInput, search, placeholder, ...props } = _props
	return (
		<Input
			onChangeText={handleChangeInput}
			value={search}
			noLabel
			label={placeholder}
			renderRightAccessory={() => (
				<Icon name="search" style={{ color: ColorsList.primary }} />
			)}
			{...props}
		/>
	)
}

const InputClear = props => {
	return <SearchInput noSearch {...props} />
}

export default SearchInput
export { InputClear, SearchInputV2 }

const styles = StyleSheet.create({
	searchWrapper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	textInput: {
		textDecorationLine: "none",
		fontFamily: FontName.Regular,
		color: ColorsList.primary,
	},
	deleteIcon: {
		backgroundColor: "blue",
		width: "10%",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 7,
	},
})
