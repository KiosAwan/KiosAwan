import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"
import { SizeList } from "src/styles/size"

const styles = StyleSheet.create({
	selectContainer : { 
        backgroundColor: ColorsList.whiteColor, 
        padding: 10 
    },
    selectWrapper : { 
        borderBottomWidth: 1, 
        borderBottomColor : ColorsList.greySoft
    },
    dropdownStyle : { 
        top : 0,
        minWidth:SizeList.width,   
    },
    dropdownContentStyle : {
        elevation: 3, 
        backgroundColor: ColorsList.whiteColor,
    }
})
export default styles