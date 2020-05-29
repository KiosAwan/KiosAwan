import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin } from "src/utils/stylehelper"

const styles = StyleSheet.create({
	topComp: {
		...$Margin(0, 0, 10),
		borderRadius: 5,
		justifyContent: "flex-end",
		backgroundColor: ColorsList.whiteColor
	},
	listPulsa: {
		margin: 5,
	},
	pulsaWrapper: {
		padding : 5,
		borderRadius : 5,
		backgroundColor: ColorsList.whiteColor,
		...$Margin(0, 0, 5)
	},
	pulsaWrapperActive: {
		borderColor: ColorsList.primary,
	},
	pulsaComp: {
		...$Margin(3, 10)
	},
	simpan: {
		// alignSelf: "flex-end",
		flexDirection: "row",
		alignItems: "center",
		justifyContent : "space-between",
		marginHorizontal: 10,
		marginBottom: 10
	}
})
export default styles