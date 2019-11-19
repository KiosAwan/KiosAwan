import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { FontList } from '../../styles/typography';

export const CategoryText = (props) =>  {
    return (
        <Text style={styles.textStyle}>{props.title}</Text>
    );
}

const styles = StyleSheet.create({
    textStyle : {
        ...FontList.titleFont,
        color : '#cd0192'
    }
})
