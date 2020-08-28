import SearchInput from "../Input/SearchInput"
import React, { useState } from "react"
import Icon from "react-native-vector-icons/FontAwesome5"
import BarStatus from "../BarStatus"
import { Wrapper } from "../View/Wrapper"
import { View, Image } from "react-native"
import { TouchableOpacity, TextInput } from "react-native-gesture-handler"
import { Text } from "../Text/CustomText"
import { Header } from "native-base"
import { ColorsList } from "src/styles/colors"
import { Button } from "../Button/Button"
import { SizeList } from "src/styles/size"
import { Input } from "../Input/MDInput"
import Divider from "../Row/Divider"

export const HeaderRegister = () => {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				paddingTop: 10,
			}}>
			<Image
				style={{ width: 160, height: 90 }}
				source={require("src/assets/images/logo.png")}
			/>
		</View>
	)
}

export const GlobalHeaderWithIcon = props => {
	return <GlobalHeader {...props} />
}

export const GlobalHeader = props => {
	const {
		iconBack,
		iconColor,
		titleColor,
		onPressBack,
		handleDeleteCategory,
		handlePressIcon,
		onPressIcon,
		image,
		transparent,
		onlyTitle,
		children,
		leftProps,
		rightProps,
		style,
		title = "",
		renderLeftAccessory: LeftAccessory,
		renderRightAccessory: RightAccessory,
	} = props
	const renderLeftAccessory = () => {
		return typeof LeftAccessory == "function" ? (
			LeftAccessory()
		) : onlyTitle ? (
			<View style={{ width: 40 }} />
		) : (
			<Button
				color="link"
				flexStart
				padding={0}
				onPress={onPressBack}
				{...leftProps}>
				<Icon
					name={iconBack || "arrow-left"}
					style={{ width: 40 }}
					size={20}
					color={iconColor || ColorsList.greyFont}
				/>
			</Button>
		)
	}
	const renderRightAccessory = () => {
		return RightAccessory || children || image ? (
			typeof RightAccessory == "function" ? (
				<View style={{ width: 40, alignItems: "flex-end" }}>
					{RightAccessory()}
				</View>
			) : (
				!onlyTitle && (
					<Button
						color="link"
						flexEnd
						padding={0}
						onPress={handleDeleteCategory || handlePressIcon || onPressIcon}
						{...rightProps}>
						{renderImage()}
					</Button>
				)
			)
		) : (
			<Divider size={40} color="link" />
		)
	}
	const renderMid = () => {
		if (children) {
			return <View _flex>{children}</View>
		} else {
			if (typeof title == "string") {
				return (
					<Text
						_flex
						align="center"
						font="SemiBold"
						color={
							transparent
								? titleColor || ColorsList.greyFontHard
								: ColorsList.greyFontHard
						}>
						{title.toUpperCase()}
					</Text>
				)
			}
		}
	}
	const renderImage = () => {
		try {
			if (["number"].includes(typeof image)) {
				throw new Error()
			}
			return image
		} catch (err) {
			return <Image style={{ width: 40, height: 40 }} source={image} />
		}
	}
	const render = () => (
		<Wrapper
			style={{
				paddingHorizontal: SizeList.bodyPadding,
				width: "100%",
				...style,
			}}
			spaceBetween={!onlyTitle}>
			{renderLeftAccessory()}
			{renderMid()}
			{renderRightAccessory()}
		</Wrapper>
	)
	return (
		<Header
			androidStatusBarColor={ColorsList.greyAuthHard}
			style={{
				paddingLeft: 0,
				paddingRight: 0,
				backgroundColor: "transparent",
				elevation: 0,
			}}>
			{render()}
		</Header>
	)
}

export const IconHeader = props => {
	const { onPress, disabled, ..._props } = props
	return (
		<TouchableOpacity disabled={disabled} onPress={onPress}>
			<Icon color={ColorsList.secondary} {..._props} size={20} />
		</TouchableOpacity>
	)
}
export const ImageHeader = props => (
	<Image {...props} style={{ width: 30, height: 30 }} />
)

export const SearchHeader = _props => {
	const {
		title,
		label,
		search,
		onChangeText,
		onPressIcon = () => null,
		...props
	} = _props
	const [active, setActive] = useState(false)
	return (
		<GlobalHeader
			title={title}
			renderRightAccessory={() => (
				<Button
					onPress={() => {
						setActive(!active)
						onPressIcon()
					}}
					color="link"
					padding={0}>
					<Icon
						size={active ? 17 : 20}
						style={{ color: ColorsList.greyFont }}
						name={active ? "times-circle" : "search"}
					/>
				</Button>
			)}
			{...props}>
			{active && (
				<Input
					transparent
					noLabel
					autoFocus
					label={label}
					value={search}
					onChangeText={onChangeText}
					inputStyle={{ textAlign: "center" }}
				/>
			)}
		</GlobalHeader>
	)
}
