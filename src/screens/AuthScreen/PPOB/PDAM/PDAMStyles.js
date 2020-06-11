import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { $Margin, $Padding } from "src/utils/stylehelper"
import { SizeList } from "src/styles/size"

const styles = StyleSheet.create({
    topComp: {
        borderRadius: 5,
        justifyContent: "flex-end",
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
    selectContainer: {
        backgroundColor: ColorsList.whiteColor,
        marginVertical: 10
    },
    selectWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: ColorsList.greyAuthHard
    },
    dropdownStyle: {
        top: 0,
    },
    dropdownContentStyle: {
        elevation: 3,
        backgroundColor: ColorsList.whiteColor,
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
    infoPembelian: {
        padding: 10,
        backgroundColor: ColorsList.informationBg,
        borderRadius: 5,
        marginVertical: 5
    },
})
export default styles