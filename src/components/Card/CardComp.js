import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const height = Dimensions.get('window').height

export const CardComp = (props) =>  {
    return (
        <View style={styles.wrapView}>
            <TouchableOpacity style={{backgroundColor : 'transparent'}} onPress={props.onPressCard} disabled={props.disabled}>
                <View style={[styles.card, props.cardStyle]}>
                    {props.icon ? <Image style={{width: 30, height : 40}} source={props.icon}/> : null}
                    <Text style={styles.infoText}>{props.info}</Text>
                </View>
            </TouchableOpacity>
        </View>
    
    );
}

export const LinearCardComp = (props) =>  {
    return (
        <LinearGradient style={[styles.card, {flexDirection : 'row', alignItems :"center"}]} colors={['#cd0192', '#6d1d6d']}>
                    <View style={{width : '50%', alignItems : 'center'}}>
                    <TouchableOpacity >
                        <Text style={styles.walletInfo}>Wallet Balance</Text>
                        <Text style={styles.walletInfo}>RP. 567.000</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width : '50%', alignItems : 'center'}}>
                        <TouchableOpacity >
                        <Text style={styles.walletInfo}>Today's Transaction</Text>
                        <Text style={styles.walletInfo}>RP. 800.000</Text>
                        </TouchableOpacity>
                    </View>
        </LinearGradient>
    
    );
}




const styles = StyleSheet.create({
    card : {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height : '100%',
    },
    infoText : {
        color : 'red',
        fontFamily: 'Nunito-Black',
    },
    wrapView : {
        flex : 1,
        backgroundColor : 'transparent'
    },
    walletInfo : {
        color : 'white', 
        fontSize : 12,
        textAlign : 'center'
    }
})
