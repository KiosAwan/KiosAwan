import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import { 
    View, 
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


//Own Custom Component
import {HeaderRegister} from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'

//Redux Actions
import { addFirstPIN } from '../../redux/actions/actionsRegistration'

//Functions

const height = Dimensions.get('window').height

const FirstPIN = ({navigation}) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handleChangePIN = async (pin) => {
        if(pin.length <= 6) {
            await dispatch(addFirstPIN(pin))
            if(pin.length == 6) {
                if(pin[0] == pin[1] == pin[2] == pin[3] == pin[4] == pin[5]){
                    alert("Pin tidak boleh sama semua")
                }else {
                    navigation.navigate('SecondPIN')
                }
            }  
        }    
    }
    //Next button function
    const _handleNextButton = async () => {
        if(FormRegister.firstPIN.length < 6) {
            alert("PIN harus 6 digit")
        }else {
        navigation.navigate('SecondPIN')             
    }}

    return (
    <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
        <HeaderRegister 
            onPressBack={() => navigation.goBack()}
            onPressNext={_handleNextButton}
            />
            <View style={{width : '70%', paddingTop : 30}}>
                <Text style={{textAlign : "center", color : 'white'}}>Set your PIN</Text>
            </View>
        <InputPIN
        inputWidth={200}
        value={FormRegister.firstPIN}
        handleChangeText={(pin) => _handleChangePIN(pin)}
        />
    </LinearGradient>
    );
}

export default FirstPIN

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : "center",
        backgroundColor : '#cd0192'
    },
    borderStyleBase: {
        width: 30,
        height: 45,
        borderRadius : 20
    },
    
    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
})