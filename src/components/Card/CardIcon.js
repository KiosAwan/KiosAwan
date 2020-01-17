import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Text } from '../Text/CustomText';
import { SizeList } from 'src/styles/size';

export const CardIcon = (props) => (
    <TouchableOpacity onPress={props.onPress}>
        <View style={styles.container}>
            <Image style={{ width: 50, height: 50}} source={props.icon} />
            <Text align="center" size={12}>{props.name}</Text>
        </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorsList.whiteColor,
        padding :20,
        borderRadius : 5,
        alignItems : "center",
        width : SizeList.width /4,
        height : SizeList.width/4
    }
})