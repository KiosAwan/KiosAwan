import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'
import {
    Header,
    Body
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import LinearBackground from '../LinearBackground'
import { InputSimple } from '../Input/InputComp'


const width = Dimensions.get('window').width

export const HeaderRegister = (props) => {
    return (
        <View style={styles.HeaderRegisterWrap}>
            {props.noBack ? <Text></Text> : <Text style={{ color: 'white', padding: 40 }} onPress={props.onPressBack}>Back</Text>}
            <Image style={{ width: 160, height: 90 }} source={require('../../assets/images/logo.png')} />
            <Text style={{ color: 'white', paddingHorizontal: 40 }} onPress={props.onPressNext}>Next</Text>
        </View>
    )
}


export const GlobalHeader = (props) => {
    return (
        <Header androidStatusBarColor="#cd0192">
            <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.linearHeader} >
                <TouchableOpacity onPress={props.onPressBack}>
                    <View style={{ width: width / 9, paddingLeft: 10 }}>
                        <Icon name="arrow-left"
                            size={20}
                            color="white"
                        />
                    </View>
                </TouchableOpacity>
                <Body>
                    <Text style={{ color: 'white' }}>{props.title}</Text>
                </Body>
            </LinearGradient>
        </Header>
    )
}

export const CashierHeader = (props) => {
    return (
        <Header androidStatusBarColor="#cd0192">
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.linearHeader} >
            <TouchableOpacity onPress={props.onPressBack}>
                <View style={{ width: width /9, alignItems : "center"}}>
                    <Icon name="bars"
                        size={20}
                        color="white"
                    />
                </View>
            </TouchableOpacity>
            <View style={{width : width *5 /9, flexDirection : 'row', alignItems :"center", height : '80%', borderBottomColor : '#cd0196', borderBottomWidth
        :2}}>
                <Icon name="search" color="white" size={13}/>
                <InputSimple
                placeholder="Cari produk"
                />
            </View>
            <TouchableOpacity onPress={props.onPressBack}>
                <View style={{ width: width /9,alignItems : "center"}}>
                    <Icon name="ellipsis-v"
                        size={20}
                        color="white"
                    />
                </View>
            </TouchableOpacity>
        </LinearGradient>
    </Header>
    )
}


const styles = StyleSheet.create({
    HeaderRegisterWrap: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingTop: 10
    },
    headerGlobal: {
        alignItems: "center",
    },
    linearHeader: {
        width,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent : 'space-around'
    }
})