import { StyleSheet } from "react-native"
import { ColorsList } from "src/styles/colors"

const styles = StyleSheet.create({
	selectContainer : { 
        backgroundColor: ColorsList.whiteColor, 
        padding: 10 
    },
    selectWrapper : { 
        borderBottomWidth: 1, 
        borderBottomColor : ColorsList.greySoft
    }
})
export default styles