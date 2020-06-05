import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ColorsList } from '../../styles/colors';
import { FontList } from '../../styles/typography';
import { Text } from '../Text/CustomText'

export const ManagementCategoryCard = (props) => {
    return (
        <View style={styles.mainwrap}>
            <View style={{ width: '90%', padding: 8 }}>
                <Text font="SemiBold" color="primaryColor">{props.name}</Text>
            </View>
            <TouchableOpacity onPress={props.onPressEdit} disabled={props.disabled || false} style={styles.touchableStyle}>
                <View>
                    <Image style={{ ...props.hidden && { opacity: .5 }, width: 30, height: 30 }} source={require('../../assets/icons/edit.png')} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const ManagementPelangganCard = (props) => {
    return (
        <View style={styles.mainwrap}>
            <View style={{ width: '90%', padding: 8 }}>
                <Text font="SemiBold" color="primaryColor">{props.name}</Text>
                <Text font="SemiBold" size={12}>{props.subName}</Text>
            </View>
            <TouchableOpacity onPress={props.onPressEdit} disabled={props.disabled || false} style={styles.touchableStyle}>
                <View >
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/icons/edit.png')} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainwrap: {
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: ColorsList.whiteColor,
        borderRadius: 5,
        marginTop: 10,
        paddingLeft: 5,
        elevation: 1
    },
    touchableStyle: {
        width: '10%',
        height: '100%',
        backgroundColor: ColorsList.greyBg,
        padding: 8,
        alignItems: "center"
    }
})