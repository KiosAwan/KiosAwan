import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography';
import { RowChild } from '../Helper/RowChild';
import { ColorsList } from '../../styles/colors';


const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export const CardComp = (props) =>  {
    return (
        <View style={styles.wrapView}>
            <TouchableOpacity style={{backgroundColor : 'transparent'}} onPress={props.onPressCard} disabled={props.disabled}>
                <View style={[styles.card, props.cardStyle]}>
                    <Image style={{width: 50, height : 50, marginHorizontal:10}} source={props.icon}/>
                    <View style={{width : '70%', paddingLeft :20}}>
                        <Text style={styles.infoText}>{props.info}</Text>
                        <Text style={styles.subText}>{props.subInfo}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export const TransactionCard = (props) => {
    return (
        <View style={{...RowChild, justifyContent : 'space-between', marginBottom : 20, borderBottomWidth : 2}}>
            <Icon name="money-bill-alt"/>
            <View>
                <Text>Rp. {props.total_transaction}</Text>
                <Text>{props.payment_code}</Text>
                {props.status_payment == 3 ? <Text>Dibatalkan</Text> : null}
            </View>
            <View>
                <Text>{props.payment_type}</Text>
                <Text>{props.transactiontime}</Text>
            </View>
        </View>
    )
}

export const LinearCardComp = (props) =>  {
    return (
        <View style={{height : height/15, backgroundColor : 'white', justifyContent : "center", borderRadius : 5}}>
            <View style={ {...RowChild, justifyContent : "space-between"}}>
                <View style={{flexDirection : 'row', alignItems : "center", marginLeft : 20}}>
                    <Icon size={20} name="wallet" color={ColorsList.primaryColor}/>
                    <Text style={{fontSize: 13,color : 'grey', fontFamily : FontList.primaryFont, paddingLeft : 10, paddingRight : 50}}>Saldo : Rp. 470.000</Text>
                </View>
                <TouchableOpacity>
                    <View style={styles.topUpStyle}>
                        <Text style={{color : 'white', fontFamily : 'Nunito-Bold'}}>TOP UP</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    
    );
}


export const CardTextImage = (props) =>  {
    return (
        <TouchableOpacity onPress={props.onPressCard}>
            <View style={styles.CardTextImage}>
                <Image style={styles.imageCardTextImage} source={{uri : props.image}}/>
                <View style={styles.textImageWrapper}>
                    <Text style={{fontSize : FontList.titleSize, color : 'grey', paddingHorizontal : '6%'}}>{props.info}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export const ProductCard = (props) =>  {
    return (
        <View style={{height : height/8, backgroundColor : 'white', marginBottom : 5}}>
                <View style={[styles.card, props.cardStyle]}>
                    <Image style={{width: '20%', height : '100%', marginHorizontal:5, backgroundColor : 'red'}} source={props.productImage}/>
                    <View style={{width : '50%'}}>
                        <Text style={styles.infoText}>{props.name}</Text>
                        <Text style={styles.subText}>{props.price}</Text>
                    </View>
                    <View style={{width : '30%'}}>
                        {props.quantity ? props.quantity > 0 ?
                        <View style={{...RowChild}}>
                            <TouchableOpacity onPress={props.onPressMinus}>
                                <Icon color="#cd0192" size={30} name="minus-circle"/>
                            </TouchableOpacity>
                            <Text style={{marginHorizontal : 8}}>{props.quantity}</Text>
                            <TouchableOpacity onPress={props.onPressPlus} disabled={props.plusDisabled}>
                                <Icon color="#cd0192" size={30} name="plus-circle"/>
                            </TouchableOpacity>
                        </View>
                        :
                        <Text style={styles.infoText}>Add Product</Text> :
                        <Text onPress={props.onPressAdd} style={styles.infoText}>Add Product</Text>
                    }
                    </View>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card : {
        borderRadius: 5,
        height : '100%',
        ...RowChild,
        padding: 10,
    },
    infoText : {
        color : '#cd0192',
        ...FontList.titleFont
    },
    wrapView : {
        height  : height/7,
        backgroundColor : 'transparent',
        paddingBottom : 10
    },
    walletInfo : {
        color : 'white', 
        fontSize : 12,
        textAlign : 'center',
        fontFamily : 'Nunito-Regular'
    },
    subText : {
        color : 'grey',
        ...FontList.subtitleFont
    },
    CardTextImage : {
        width: width*4/5,
        height : height/3,
        alignItems : "center", 
        marginRight : 10
    },
    imageCardTextImage : {
        width : '100%', 
        height : '60%', 
        borderTopRightRadius : 5,
        borderTopLeftRadius : 5
    },
    textImageWrapper : {
        backgroundColor : 'white',
        height: '30%',
        justifyContent : "center",
        borderBottomEndRadius:5,
        borderBottomStartRadius : 5
    },
    topUpStyle : {
        width : width/5,
        height : 25,
        marginRight : 10,
        backgroundColor :ColorsList.primaryColor,
        justifyContent : "center", 
        alignItems : "center", 
        borderRadius:5
    }
})
