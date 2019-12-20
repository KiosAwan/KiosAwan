import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography';
import { RowChild } from '../Helper/RowChild';
import { ColorsList } from '../../styles/colors';


const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export const CardComp = (props) => {
    return (
        <View style={styles.wrapView}>
            <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={props.onPressCard} disabled={props.disabled}>
                <View style={[styles.card, props.cardStyle]}>
                    <Image style={{ width: 50, height: 50, marginHorizontal: 10 }} source={props.icon} />
                    <View style={{ width: '70%', paddingLeft: 20 }}>
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
        <View style={{ ...RowChild, justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2 }}>
            <Icon name="money-bill-alt" />
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

export const LinearCardComp = (props) => {
    return (
        <View style={{ height: height / 15, backgroundColor: 'white', justifyContent: "center", borderRadius: 5 }}>
            <View style={{ ...RowChild, justifyContent: "space-between" }}>
                <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: 20 }}>
                    <Icon size={20} name="wallet" color={ColorsList.primaryColor} />
                    <Text style={{ fontSize: 13, color: 'grey', fontFamily: FontList.primaryFont, paddingLeft: 10, paddingRight: 50 }}>Saldo : Rp. 470.000</Text>
                </View>
                <TouchableOpacity>
                    <View style={styles.topUpStyle}>
                        <Text style={{ color: 'white', fontFamily: 'Nunito-Bold' }}>TOP UP</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    );
}


export const CardTextImage = (props) => {
    return (
        <TouchableOpacity onPress={props.onPressCard}>
            <View style={styles.CardTextImage}>
                <Image style={styles.imageCardTextImage} source={{ uri: props.image }} />
                <View style={styles.textImageWrapper}>
                    <Text style={{ fontSize: FontList.titleSize, color: ColorsList.greyFont, paddingHorizontal: '6%' }}>{props.info}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export const ImageText = props => {
    return <View style={[styles.viewNoImageProduct, { width: props.size || '20%', height: props.size || '70%' }, props.style]}>
        <Text style={{ fontSize: 24, fontFamily: 'Nunito-Bold', color: ColorsList.greyFont }}>{props.name.generateInitial()}</Text>
    </View>
}

export const ProductCard = (props) => {
    return (
        <View style={{ height: height / 7, backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
            <View style={[styles.card, props.cardStyle]}>
                <View style={{ ...RowChild, height: '100%', width: '90%' }}>
                    {props.productImage ?
                        <Image style={{ width: '20%', height: '70%', margin: 5, backgroundColor: 'red' }} source={{ uri: props.productImage }} />
                        :
                        <ImageText name={props.name} />
                    }
                    <View style={{ width: '50%' }}>
                        <Text style={styles.infoText}>{props.name}</Text>
                        <Text style={styles.subText}>{props.stock ? props.stock : "Fitur stok tidak aktif"}</Text>
                        <Text style={[styles.infoText, { color: ColorsList.greyFont }]}>{props.price}</Text>
                    </View>
                </View>
                {
                    props.right ? props.right :
                        <View style={{ width: '10%', backgroundColor: '#f9faf7', height: '100%', justifyContent: "space-around", alignItems: "center", borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                            <TouchableOpacity onPress={props.onPressPlus} disabled={props.plusDisabled} style={styles.cardPlusMinusIcon}>
                                <Icon size={20} name="plus" color={ColorsList.greyFont} />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8 }}>{props.quantity ? props.quantity : 0}</Text>
                            <TouchableOpacity onPress={props.onPressMinus} style={styles.cardPlusMinusIcon}>
                                <Icon size={20} name="minus" color={ColorsList.greyFont} />
                            </TouchableOpacity>
                        </View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        height: '100%',
        ...RowChild,
        // justifyContent : 'space-between',
    },
    infoText: {
        color: '#cd0192',
        ...FontList.titleFont
    },
    wrapView: {
        height: height / 7,
        backgroundColor: 'transparent',
        paddingBottom: 10
    },
    walletInfo: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Nunito-Regular'
    },
    subText: {
        color: 'grey',
        ...FontList.subtitleFont
    },
    CardTextImage: {
        width: width * 4 / 5,
        height: height / 3,
        alignItems: "center",
        marginRight: 10
    },
    imageCardTextImage: {
        width: '100%',
        height: '60%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        resizeMode: 'stretch'
    },
    textImageWrapper: {
        backgroundColor: 'white',
        height: '30%',
        justifyContent: "center",
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5
    },
    topUpStyle: {
        width: width / 5,
        height: 25,
        marginRight: 10,
        backgroundColor: ColorsList.primaryColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    },
    cardPlusMinusIcon: {
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        padding: 5
    },
    viewNoImageProduct: {
        width: '20%',
        height: '70%',
        margin: 5,
        backgroundColor: ColorsList.greyAuthHard,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    }
})
