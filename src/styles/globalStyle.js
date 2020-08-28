import { StyleSheet, Dimensions } from "react-native"
import { SizeList } from "./size"
import { ColorsList } from "./colors"

const height = Dimensions.get("window").height
export const stylesglobe = StyleSheet.create({
	background: {
		backgroundColor: "white",
	},
	paddingContainer: {
		padding: 20,
	},
	topBarHeight: {
		height: height * 0.08,
		backgroundColor: "white",
	},
	absoluteBottom: {
		position: "absolute",
		bottom: 10,
		alignSelf: "center",
	},
	shadowView: {
		borderColor: ColorsList.borderColor,
		borderWidth: SizeList.borderWidth,
		backgroundColor: ColorsList.white,
		borderRadius: SizeList.borderRadius,
	},
})
