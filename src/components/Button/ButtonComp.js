import React from 'react'

import {Dimensions, StyleSheet } from 'react-native'
import {
    Button,
    Text
} from 'native-base'

const width = Dimensions.get('window').width

export const RegisterButton = (props) => {
    return (
        <Button primary style={[styles.btn, props.style]}
        disabled={props.disabled}
        onPress={props.onPressBtn}
        >
            <Text>{props.buttonTitle}</Text>
        </Button>
    )
}

export const BottomButton = (props) => {
    return (
        <Button
            primary
            onPress={props.onPressBtn}
            style={[props.style,{width , justifyContent : "center", backgroundColor : 'transparent'}]}
          >
            <Text>{props.buttonTitle}</Text>
        </Button>
    )
}

const styles = StyleSheet.create({
    btn : {
        justifyContent : "center",
        width : width * 3/4,
        alignSelf: 'center',
        borderRadius : 5,
        backgroundColor : '#cd0192'
    }
})