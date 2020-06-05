import React from 'react';
import { View } from 'react-native'
import { RowChild } from '../Helper/RowChild';
import { FontList } from '../../styles/typography';
import { Text } from '../Text/CustomText';

export const RowOpposite = (props) => (
    <View style={{...RowChild, justifyContent: "space-between"}}>
        <Text>{props.title}</Text>
        <Text>{props.content}</Text>
    </View>
)
