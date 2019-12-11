import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

require('../../assets/images/addproductsuccess.png')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const ModalContent = (props) => {
    return (
        <TouchableOpacity onPress={props.closeModal} style={styles.touchableStyle}>
            <View style={styles.wrapView}>
                <Image style={{ height: '80%', width: '80%' }} source={props.image} />
                <View style={{width : '70%'}}>
                    <Text style={{fontFamily : 'Nunito-SemiBold', fontSize: 20, textAlign: "center", color : 'grey' }}>{props.infoText}</Text>
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
        width: width * 0.8,
        height: width * 0.9,
        backgroundColor: 'white',
        borderRadius: 5
    }
})