import React from 'react'
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native'
import { RegisterButton } from '../../components/Button/ButtonComp'
import { ColorsList } from '../../styles/colors'
import { CardComp, LinearCardComp } from '../../components/Card/CardComp'
import { CategoryText } from '../../components/Text/CategoryText'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography'
import { TouchableOpacity } from 'react-native-gesture-handler'


const height = Dimensions.get('window').height
const Home = ({navigation}) => {    
    const _onPressLogout = () => {
        navigation.navigate('PhoneRegistration')
    }

    const _onPressCashier = () => {
        navigation.navigate("Cashier")
    }

    const _onPressPayment = () => {
        navigation.navigate("Payment")
    }

    const _onPressStock = () => {
        navigation.navigate("Stock")
    }
    return (
        <ScrollView style={styles.container}>
            <StatusBar
                backgroundColor={ColorsList.primaryColor}/>
            <View style={styles.firstChildView}>
                <View style={styles.wrapChildRow}>
                    <Icon color="red" size={16} name="map-marker-alt"/>
                    <Text style={styles.locationInfo}>Kuningan, Jakarta Selatan</Text>
                </View>
                <View style={styles.wrapChildRow}>
                    <Icon style={{paddingRight : 10}} size={16} name="bell"/>
                    <Icon size={16} name="cog"/>
                </View>
            </View>
            <View style={styles.secondChildView}>
                <LinearCardComp/>
            </View>
            {/* <CategoryText title="Functions"/> */}
            <View style={styles.wrapCard}>
                <CardComp info="Cashier"
                cardStyle={{backgroundColor :'white'}}
                icon={require("../../assets/icons/icon-cashier.png")}
                onPressCard={_onPressCashier}
                />
                <CardComp info="Payment"
                icon={require("../../assets/icons/icon-payment.png")}
                cardStyle={{marginHorizontal: 10, backgroundColor :'white'}}
                onPressCard={_onPressPayment}
                />
                <CardComp info="Stock"
                cardStyle={{backgroundColor :'white'}}
                icon={require("../../assets/icons/icon-restock.png")}
                onPressCard={_onPressStock}
                />
            </View>
            {/* <RegisterButton
            disabled={false}
            buttonTitle="Logout"
            onPressBtn={_onPressLogout}
            /> */}
        </ScrollView>

    )
}

export default Home

const styles = StyleSheet.create({
    container : {
        padding: 15,
        backgroundColor :ColorsList.authBackground
    },
    wrapCard : {
        height : height/6,
        flexDirection: 'row',
        paddingVertical : 5,
        justifyContent : 'space-between'
    },
    firstChildView : {
        height : height/15,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems: 'center',
    },
    secondChildView : {
        height : height/7,
        paddingVertical : 10
    },
    thirdChildView : {
        height : height/3,
        borderWidth : 1
    },
    fourthChildView : {
        height : height/3,
        borderWidth : 1
    },
    wrapChildRow : {
        flexDirection : "row", 
        alignItems : "center"
    },
    locationInfo : {
        paddingLeft : 10,
        fontFamily : FontList.primaryFont
    },

    
})