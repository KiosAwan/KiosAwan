import React from 'react'

import { Dimensions, StyleSheet, View, Image } from 'react-native'
import {
    Button,
    Text
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography'
import { ColorsList } from '../../styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RowChild } from '../Helper/RowChild'
import { SizeList } from '../../styles/size'
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
            style={[{ width, justifyContent: "center", backgroundColor: 'transparent' }, props.style]}
        >
            {props.content ? props.content :
                <Text>{props.buttonTitle}</Text>
            }
        </Button>
    )
}

export const ButtonWithIcon = (props) => {
    return (
        <TouchableOpacity onPress={props.onPressBtn}>
            <View style={[props.style, { borderRadius: 5, ...RowChild, padding: 8 }]} >
                <Icon color={ColorsList.primaryColor} size={14} style={{ marginRight: 5 }} name={props.iconName} />
                <Text style={[styles.btnwithIconText, props.fontStyle]}>{props.buttonTitle}</Text>
            </View>
        </TouchableOpacity>
    )
}

export const TouchableImage = (props) => {
    const IMAGE_WIDTH = SizeList.width / 4
    return (
        <TouchableOpacity onPress={props.onPressBtn} style={{ width: '100%' }}>
            <Image style={styles.imageButton} source={{ uri: props.image }} />
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn: {
        justifyContent: "center",
        width: width * 3 / 4,
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: ColorsList.primaryColor
    },
    btnwithIconText: {
        ...FontList.titleFont,
        color: ColorsList.primaryColor,
    },
    imageButton: {
        width: SizeList.width / 4,
        height: 60,
        alignSelf: "center",
        justifyContent :"center",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#c0c0c0'
    }
})