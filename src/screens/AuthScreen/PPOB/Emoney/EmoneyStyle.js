import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin, $Padding } from "src/utils/stylehelper"
import { SizeList } from "src/styles/size"

const styles = StyleSheet.create({
	topComp: {
		...$Margin(15, 15, 10),
		...$Padding(0, 10),
		borderRadius: 5,
		justifyContent: "flex-end",
		backgroundColor: ColorsList.whiteColor,
	},
	listPulsa: {
		padding: 10,
		marginBottom: 70,
	},
	pulsaWrapper: {
		flex: 1,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: ColorsList.whiteColor,
		backgroundColor: ColorsList.whiteColor,
		...$Margin(0, 5, 10),
	},
	pulsaWrapperActive: {
		borderColor: ColorsList.primary,
	},
	pulsaComp: {
		...$Margin(5, 10),
	},
	selectContainer: {
		backgroundColor: ColorsList.whiteColor,
		marginVertical: 10,
	},
	selectWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: ColorsList.greyAuthHard,
	},
	dropdownStyle: {
		top: 0,
	},
	dropdownContentStyle: {
		elevation: 3,
		backgroundColor: ColorsList.whiteColor,
	},
	listPulsa: {
		padding: 10,
		marginBottom: 70,
	},
	pulsaWrapper: {
		flex: 1,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: ColorsList.whiteColor,
		backgroundColor: ColorsList.whiteColor,
		...$Margin(0, 5, 10),
	},
	pulsaWrapperActive: {
		borderColor: ColorsList.primary,
	},
	pulsaComp: {
		...$Margin(5, 10),
	},
})
export default styles
