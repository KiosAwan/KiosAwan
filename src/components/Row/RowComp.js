import React from 'react';
import { View, Text } from 'react-native'
import { RowChild } from '../Helper/RowChild';
import { FontList } from '../../styles/typography';

export const RowOpposite = (props) => (
    <View style={{...RowChild, justifyContent: "space-between", marginBottom : 5}}>
        <Text style={{...FontList.subtitleFontGrey}}>{props.title}</Text>
        <Text style={{...FontList.subtitleFontGreyBold}}>{props.content}</Text>
    </View>
)
