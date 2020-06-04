import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin, $Padding } from "src/utils/stylehelper"
import { SizeList } from "src/styles/size"

const styles = StyleSheet.create({
	topComp: {
		borderRadius: 5,
		justifyContent: "flex-end",
		backgroundColor: ColorsList.whiteColor
	},
	infoPembelian: {
		padding: 10,
		backgroundColor: ColorsList.infoBg,
		borderRadius: 5,
		marginVertical : 5,
		elevation : 1
	},
	listPulsa: {
		padding: 10,
		marginBottom: 70
	},
	pulsaWrapper: {
		padding: SizeList.secondary,
		borderRadius:SizeList.borderRadius,
		backgroundColor: ColorsList.whiteColor,
		borderWidth: 1,
		borderColor: ColorsList.greyAuthHard,
		marginBottom : SizeList.base,
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
		margin : SizeList.base
	},
	custInfo: {
		borderRadius: 5,
		backgroundColor: ColorsList.whiteColor,
		elevation : 1,
		marginBottom : 10,
		padding: 10
	},
})
export default styles