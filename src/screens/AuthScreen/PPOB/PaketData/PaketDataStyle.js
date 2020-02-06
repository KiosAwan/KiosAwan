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
        padding: 10,
        marginBottom : 70
	},
	pulsaWrapper: {
		flex: 1,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: ColorsList.whiteColor,
		backgroundColor: ColorsList.whiteColor,
		...$Margin(0, 5, 10)
	},
	pulsaWrapperActive: {
		borderColor: ColorsList.primary,
	},
	pulsaComp: {
		...$Margin(5, 10)
	}
})
export default styles