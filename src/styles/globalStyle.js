import { StyleSheet, Dimensions } from 'react-native'


const height = Dimensions.get('window').height
export const stylesglobe = StyleSheet.create({
    background : {
        backgroundColor : 'white'
    },
    paddingContainer : {
        padding : 20
    },
    topBarHeight : {
        height : height * 0.08,
        backgroundColor : 'white'
    },
    absoluteBottom : { 
        position: "absolute", 
        bottom: 10, 
        alignSelf: "center",
    }
})