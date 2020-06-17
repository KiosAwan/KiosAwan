import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { SizeList } from "src/styles/size"

const styles = StyleSheet.create({
    selectContainer: {
        backgroundColor: ColorsList.whiteColor,
        padding: 10
    },
    selectWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: ColorsList.greySoft
    },
    dropdownStyle: {
        top: 0,
        minWidth: SizeList.width,
    },
    dropdownContentStyle: {
        elevation: 3,
        backgroundColor: ColorsList.whiteColor,
    },
    wrapper: {
        padding: 5,
        paddingHorizontal: 10,
    },
    leftWrapper: {
    },
    rightWrapper: {
        width: '40%',
        padding: 5,
    },
    viewShadow: {
        paddingHorizontal: SizeList.padding,
        backgroundColor: ColorsList.white,
        borderRadius: SizeList.borderRadius,
        borderWidth: SizeList.borderWidth,
        borderColor: ColorsList.borderColor
    }
})
export default styles