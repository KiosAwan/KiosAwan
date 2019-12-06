import React from 'react';
import { View, Text } from 'react-native'
import { RowChild } from '../Helper/RowChild';

export const RowOpposite = (props) => (
    <View style={{...RowChild, justifyContent: "space-between"}}>
        <Text>{props.title}</Text>
        <Text>{props.content}</Text>
    </View>
)
