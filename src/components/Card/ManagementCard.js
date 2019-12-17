import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native';
import { ColorsList } from '../../styles/colors';
import { FontList } from '../../styles/typography';
import { Text } from '../Text/CustomText'

export const ManagementCard = (props) => {
    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", backgroundColor: ColorsList.whiteColor, borderRadius: 5 }}>
            <View style={{ width: '90%', padding: 8 }}>
                <Text font="Bold">{props.name}</Text>
            </View>
            <TouchableOpacity style={{ width: '10%', height: '100%', backgroundColor: ColorsList.greyBg, padding: 8, alignItems: "center" }}>
                <View >
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/icons/edit.png')} />
                </View>
            </TouchableOpacity>
        </View>
    )
}