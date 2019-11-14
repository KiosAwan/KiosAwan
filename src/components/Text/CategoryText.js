import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { FontList } from '../../styles/typography';

const height = Dimensions.get('window').height

export const CategoryText = (props) =>  {
    return (
        <Text style={styles.textStyle}>{props.title}</Text>
    );
}


const styles = StyleSheet.create({
    textStyle : {
        fontSize : 16,
        fontFamily : FontList.primaryFont
    }
})
