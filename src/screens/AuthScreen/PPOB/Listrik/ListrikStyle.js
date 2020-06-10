import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin, $Padding } from "src/utils/stylehelper"
import { SizeList } from "src/styles/size"

const styles = StyleSheet.create({
	topComp: {
		borderRadius: 5,
		justifyContent: "flex-end",
	},
	infoPembelian: {
		padding: 10,
		backgroundColor: ColorsList.informationBg,
		marginVertical: SizeList.base,
		borderWidth: SizeList.borderWidth,
		borderRadius: SizeList.borderRadius,
		borderColor: ColorsList.borderColor
	},
	listPulsa: {
		padding: 10,
	},
	pulsaWrapper: {
		padding: SizeList.secondary,
		borderRadius: SizeList.borderRadius,
		backgroundColor: ColorsList.whiteColor,
		borderWidth: 1,
		borderColor: ColorsList.greyAuthHard,
		marginBottom: SizeList.base,
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
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: SizeList.base
	},
	custInfo: {
		backgroundColor: ColorsList.whiteColor,
		marginBottom: 10,
		padding: 10, 
		borderWidth: SizeList.borderWidth, 
		borderRadius: SizeList.borderRadius, 
		borderColor : ColorsList.borderColor
	},
})
export default styles