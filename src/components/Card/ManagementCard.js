import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ColorsList } from '../../styles/colors';
import { FontList } from '../../styles/typography';
import { Text } from '../Text/CustomText'
import { SizeList } from 'src/styles/size';

export const ManagementCategoryCard = (props) => {
    return (
        <View style={styles.mainwrap}>
            <View style={{ width: '90%' }}>
                <Text>{props.name}</Text>
            </View>
            <TouchableOpacity onPress={props.onPressEdit} disabled={props.disabled || false} style={styles.touchableStyle}>
                <View>
                    <Image style={{ ...props.hidden && { opacity: .5 }, width: 20, height: 20 }} source={require('../../assets/icons/edit.png')} />
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
        paddingLeft: SizeList.padding,
        borderWidth: SizeList.borderWidth,
        borderColor: ColorsList.borderColor
    },
    touchableStyle: {
        width: '10%',
        height: '100%',
        paddingVertical: SizeList.base,
        paddingRight : SizeList.base,
        alignItems: "center"
    }
})