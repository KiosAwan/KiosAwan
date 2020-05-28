import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin } from "src/utils/stylehelper"

const styles = StyleSheet.create({
	topComp: {
		...$Margin(15, 15, 10),
		borderRadius: 5,
		justifyContent: "flex-end",
		backgroundColor: ColorsList.whiteColor
	},
	listPulsa: {
		margin : 10,
	},
	pulsaWrapper: {
		justifyContent : "space-between",
		borderRadius: 5,
		padding: 5,
		flex : 1,
		borderWidth: 1,
		borderColor: ColorsList.whiteColor,
		backgroundColor: ColorsList.whiteColor,
		...$Margin(0, 5, 10)
	},
	pulsaWrapperActive: {
		borderColor: ColorsList.primary,
	},
	pulsaComp: {
		...$Margin(3, 10)
	},
	simpan: {
		alignSelf: "flex-end",
		flexDirection: "row",
		alignItems: "center",
		marginRight: 10,
		marginBottom: 10
	}
})
export default styles