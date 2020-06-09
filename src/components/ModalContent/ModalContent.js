import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Text } from '../Text/CustomText';
import { SizeList } from 'src/styles/size';

require('../../assets/images/addproductsuccess.png')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const ModalContent = (props) => {
    return (
        <TouchableOpacity onPress={props.closeModal} style={styles.touchableStyle}>
            <View style={styles.wrapView}>
                <Image style={{ height: '60%', width: '60%' }} source={props.image} />
                <View style={{ width: '90%' }}>
                    <Text align="center">{props.infoText}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default ModalContent;

const styles = StyleSheet.create({
    touchableStyle: {
        width,
        height,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    wrapView: {
        alignItems: "center",
        justifyContent: 'center',
        width: width * 0.7,
        height: width * 0.4,
        backgroundColor: 'white',
        borderRadius: 5
    }
})