import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin } from "src/utils/stylehelper"
import { SizeList } from "src/styles/size"

const styles = StyleSheet.create({
	topComp: {
		marginBottom : SizeList.base,
		borderRadius: SizeList.borderRadius,
		justifyContent: "flex-end",
		backgroundColor: ColorsList.whiteColor
	},
	listPulsa: {
		margin: 5,
	},
	pulsaWrapper: {
		padding: SizeList.secondary,
		borderRadius:SizeList.borderRadius,
		backgroundColor: ColorsList.whiteColor,
		borderWidth: 1,
		borderColor: ColorsList.greyAuthHard,
		marginBottom : SizeList.base
	},
	pulsaWrapperActive: {
		borderColor: ColorsList.primary,
	},
	pulsaComp: {
		...$Margin(3, 10)
	},
	simpan: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		margin : SizeList.base
	}
})
export default styles