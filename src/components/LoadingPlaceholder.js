import React from "react"
import { Dimensions, View } from "react-native"
import ContentLoader, { Rect } from "react-content-loader/native"
import { Button } from "./Button/Button"
import { Wrapper } from "./View/Wrapper"
import { Text } from "./Text/CustomText"
import { SizeList } from "src/styles/size"
import Divider from "./Row/Divider"

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

export const FavoriteLoader = () => (
	<View>
		<Button
			disabled
			style={{ borderRadius: SizeList.borderRadius }}
			color={["white"]}
			noRadius
			spaceBetween>
			<ContentLoader height={65}>
				<Rect x="10" y="15" rx="4" ry="4" width="40" height="40" />
				<Rect x="55" y="10" rx="4" ry="4" width="200" height="15" />
				<Rect x="55" y="27" rx="4" ry="4" width="200" height="15" />
				<Rect x="55" y="45" rx="4" ry="4" width="200" height="15" />
				<Rect x="270" y="20" rx="4" ry="4" width="25" height="25" />
			</ContentLoader>
		</Button>
		<Divider />
	</View>
)

export const TransactionPlaceholder = () => (
	<ContentLoader height={90}>
		<Rect x="0" y="28" rx="4" ry="4" width="50" height="50" />
		<Rect x="65" y="30" rx="4" ry="4" width="100" height="13" />
		<Rect x="65" y="47" rx="4" ry="4" width="130" height="13" />
		<Rect x={width - 120} y="41" rx="4" ry="4" width="70" height="25" />
		<Rect x="65" y="65" rx="3" ry="3" width="130" height="10" />
	</ContentLoader>
)

export const ProductPlaceholder = () => (
	<ContentLoader height={height / 7}>
		<Rect x="20" y="0" rx="5" ry="5" width="70" height="70" />
		<Rect x="100" y="10" rx="4" ry="4" width="150" height="13" />
		<Rect x="100" y="27" rx="4" ry="4" width="100" height="13" />
		<Rect x={width - 90} y="0" rx="4" ry="4" width="50" height="70" />
		<Rect x="100" y="45" rx="3" ry="3" width="100" height="10" />
	</ContentLoader>
)

export const NewsCardPlaceholder = () => (
	<ContentLoader height={200}>
		<Rect x="0" y="0" rx="5" ry="5" width={width} height="200" />
	</ContentLoader>
)
