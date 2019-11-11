import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native'

export const HeaderRegister = (props) => {
    return (
        <View style={styles.HeaderRegisterWrap}>
            {props.noBack ? <Text></Text> : <Text style={{color:'white', padding : 20}} onPress={props.onPressBack}>Back</Text>}
            <Image style={{width : 170, height : 100}} source={require('../../assets/images/logo.png')}/>
            <Text style={{color:'white', padding : 20}} onPress={props.onPressNext}>Next</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    HeaderRegisterWrap : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : "center"
    }
})