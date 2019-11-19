import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native'
import {
    Header,
    Left,
    Body
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'

export const HeaderRegister = (props) => {
    return (
        <View style={styles.HeaderRegisterWrap}>
            {props.noBack ? <Text></Text> : <Text style={{color:'white', padding : 40}} onPress={props.onPressBack}>Back</Text>}
            <Image style={{width : 160, height : 90}} source={require('../../assets/images/logo.png')}/>
            <Text style={{color:'white',paddingHorizontal : 40}} onPress={props.onPressNext}>Next</Text>
        </View>
    )
}


export const GlobalHeader = (props) => {
    return (
        <View>
            <Header androidStatusBarColor="#cd0192" style={styles.headerGlobal}>
                <Left>
                    <Icon name="chevron-left"
                    size={20}
                    color="white"
                    onPress={props.onPressBack}
                    />
                </Left>
                <Body>
                    <Text style={{color: 'white', textAlign : "center"}}>{props.title}</Text>            
                </Body>
            </Header>
        </View>
    )   
}


const styles = StyleSheet.create({
    HeaderRegisterWrap : {
        flexDirection : 'row',
        alignItems : "center",
        justifyContent  :'space-between',
        paddingTop : 10
    },
    headerGlobal : {
        backgroundColor : '#cd0192'
    }
})