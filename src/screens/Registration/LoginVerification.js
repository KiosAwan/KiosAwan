import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

//Styling
import { 
    View, 
    StyleSheet,
} from 'react-native';
import { 
    Text
} from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';

//Redux Actions
import { clearAllRegistration, addFirstPIN } from '../../redux/actions/actionsRegistration'

//Functions
import { sendUserPIN, sendForgotPIN } from '../../utils/unauthhelper';
import BarStatus from '../../components/BarStatus';
import { getProfile } from '../../redux/actions/actionsUserData';


const LoginVerification = (props) => {
    const dispatch = useDispatch()
    const RegisterOTP = useSelector(state => state.Registration)


    //Sending OTP code to server
    const _handlePINFulfilled = async (pin) => {
        await dispatch(addFirstPIN(pin))
        const data = {
            phone_number : "62"+RegisterOTP.phone_number,
            pin
        }
        const res = await sendUserPIN(data)
        if(res.data.errors){
            alert(res.data.errors.msg)
        }
        else {
            await dispatch(clearAllRegistration())
            await AsyncStorage.setItem('userId', res.data.id)
            await dispatch(getProfile(res.data.id))
            props.navigationHome() 
        }
    }

    const _forgotPIN = async () => {
        const data ={
            phone_number : "62"+RegisterOTP.phone_number
        }
        const res = await sendForgotPIN(data)
        console.log(res)
        props.closeLoginSheet()
        props.navigationForgot()
    }

    return (
    <View style={styles.container}>
        <BarStatus/>
        <View style={{padding : 10}}></View>
        <Text>This number has been registered before</Text>
        <Text>Enter your KIOSAWAN PIN</Text>
            <CodeInput
            secureTextEntry
            className='border-circle'
            keyboardType="numeric"
            activeColor='#cd0192'
            inactiveColor='#cd0192'
            codeLength={6}
            size={30}
            autoFocus
            onFulfill={(code) => _handlePINFulfilled(code)}
            />
        <View style={{ padding : 50}}>
            <Text style={styles.textForgot} onPress={_forgotPIN}>
                Forgot PIN ?
            </Text>
        </View>
    </View>
    );
}

export default LoginVerification

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : "center"
    },
    textForgot : {
        color : 'blue'
    }
})