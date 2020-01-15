import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontList } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';

const SearchInput = (props) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <View style={[styles.searchWrapper, isFocused ? { borderWidth: 1, borderColor: ColorsList.primaryColor, borderRadius: 5 } : { borderBottomWidth: 0.5, borderColor: ColorsList.greySoft }]}>
            <Animatable.View duration={300} style={{ width: '5%', marginHorizontal : 5 }} animation={isFocused ? null : null}>
                <Icon size={15} style={{ width: '100%', color: ColorsList.primary }} name="search" />
            </Animatable.View>
            <TextInput style={{ width: '75%' }}
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                onChangeText={props.handleChangeInput}
                value={props.search}
                style={styles.textInput}
                placeholder={props.placeholder} />
            <Animatable.View duration={500} style={styles.deleteIcon} animation={isFocused ? "slideInRight" : 'bounceOutRight'}>
                <TouchableOpacity onPress={props.handleDeleteSearch}>
                    <Image style={{ width: 25, height: 25 }} source={require('../../assets/icons/circlereject.png')} />
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

export default SearchInput

const styles = StyleSheet.create({
    searchWrapper: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-around'
    },
    textInput: {
        width: '75%',
        fontWeight: '500',
        textDecorationLine: 'none',
        fontFamily: FontList.regularFont,
        color: ColorsList.primaryColor
    },
    deleteIcon: {
        width: '10%',
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 7
    }
})