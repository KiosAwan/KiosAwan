import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Text } from '../Text/CustomText';
import { SizeList } from 'src/styles/size';

export const CardIcon = (props) => (
    <TouchableOpacity onPress={props.onPress}>
        <View style={styles.container}>
            <Image style={{ width: 50, height: 50 }} source={props.icon} />
            <Text align="center" size={12}>{props.name}</Text>
        </View>
    </TouchableOpacity>
)

export const PPOBCard = (props) => (
    <TouchableOpacity disabled={props.status != 1 ? true : false} onPress={props.onPress}>
        <View style={styles.container}>
            <Image style={{ width: 50, height: 50 }} source={{ uri: props.icon }} />
            <Text align="center" size={12}>{props.name}</Text>
            {props.status != 1 ?
                // <View style={{ position: "absolute", right: 0, top: 0, padding : 3}}>
                <Text color={props.status == 0 ? "primary" : "warning"} size={10}>{props.info.ucwords()}</Text>
                // </View>
                : null}
        </View>
    </TouchableOpacity>
)
const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorsList.whiteColor,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: SizeList.width / 4,
        height: SizeList.width / 4
    },
})