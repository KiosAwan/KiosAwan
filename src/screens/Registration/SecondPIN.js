import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import { 
    View, 
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//Own Custom Component
import {HeaderRegister} from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'


//Redux Actions
import { addSecondPIN, clearAllRegistration } from '../../redux/actions/actionsRegistration'
import { registerUser } from '../../utils/unauthhelper';

//Functions

const height = Dimensions.get('window').height

const FirstPIN = ({navigation}) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handlePINFulfilled = async (pin) => {
        
    }
    const _handleChangePIN = async (pin) => {
        await dispatch(addSecondPIN(pin))
        if (pin.length == 6) {
            if(FormRegister.firstPIN != pin) {
                alert("Pin harus sama")
            }else {
                const data = {
                    name : FormRegister.name,
                    phone_number : "62"+FormRegister.phone_number,
                    role : 'Owner',
                    pin : pin
                }
            const res = await registerUser(data)
            await dispatch(clearAllRegistration())
            navigation.navigate('Home') 
            }
        }
    }
    //Next button function
    const _handleNextButton = async () => {
        if(FormRegister.firstPIN != FormRegister.secondPIN) {
            alert("Pin harus sama")
        }else {
        navigation.navigate('Home')             
    }}

    return (
    <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
        <HeaderRegister 
            onPressBack={() => navigation.goBack()}
            onPressNext={_handleNextButton}
            />
            <View style={{width : '70%', paddingTop : 30}}>
                <Text style={{textAlign : "center", color : 'white'}}>Confirm your PIN</Text>
            </View>
            <InputPIN
            inputWidth={250}
            value={FormRegister.secondPIN}
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
        height: 45
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