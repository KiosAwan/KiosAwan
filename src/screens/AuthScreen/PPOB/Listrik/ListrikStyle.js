import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin, $Padding } from "src/utils/stylehelper"

const styles = StyleSheet.create({
	topComp: {
		...$Margin(15, 15, 10),
		...$Padding(0, 10),
		borderRadius: 5,
		justifyContent: "flex-end",
		backgroundColor: ColorsList.whiteColor
	},
	infoPembelian: {
		marginHorizontal: 15,
		padding: 10,
		backgroundColor: ColorsList.infoBg,
		borderRadius: 5,
		marginVertical : 5
	},
	listPulsa: {
		padding: 10,
		marginBottom: 70
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
	},
	cekTagihan: {
		paddingHorizontal: 20,
		alignSelf: "center",
		paddingBottom: 10
	},
	simpan: {
		alignSelf: "flex-end",
		flexDirection: "row",
		alignItems: "center",
		marginRight: 10,
		marginBottom: 10
	},
	custInfo: {
		borderRadius: 5,
		backgroundColor: ColorsList.whiteColor,
		marginHorizontal: 15,
		marginBottom : 10,
		padding: 10
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