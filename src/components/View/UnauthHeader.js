import React from "react"
import { Image, View } from "react-native"
import { Icon } from "native-base"
import { SizeList } from "src/styles/size"
import { ColorsList } from "src/styles/colors"
import { GlobalHeader } from "../Header/Header"

const UnauthHeader = props => {
	return (
		<View>
			<Image
				style={{
					resizeMode: "contain",
					width: 100,
					height: 50,
					alignSelf: "center",
				}}
				source={require("src/assets/images/logo.png")}
			/>
		</View>
	)
}

export const UnauthBackHeader = props => {
	return (
		<GlobalHeader
			onPressBack={props.onPressBack}
			style={{ paddingHorizontal: 0 }}
		/>
	)
	// <View>
	// 	<Icon name="arrow-back" style={{ color: ColorsList.greyFont }} onPress={props.onPressBack} />
	// </View>
}

export default UnauthHeader
