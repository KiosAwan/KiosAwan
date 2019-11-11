import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import { 
    View, 
    StyleSheet,
    Dimensions
} from 'react-native';
import { 
    Text
} from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input'

//Redux Actions
import { clearAllRegistration, addFirstPIN } from '../../redux/actions/actionsRegistration'

//Functions
import { sendUserPIN } from '../../utils/unauthhelper';

const height = Dimensions.get('window').height

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
        console.log(data)
        const res = await sendUserPIN(data)
        if(res.data.errors){
            alert(res.data.errors.msg)
        }
        else {
            await dispatch(clearAllRegistration())
            props.navigationHome() 
        }
    }

    return (
    <View style={styles.container}>
        <Text style={{paddingTop : 20}}>This number has been registered before</Text>
        <Text>Enter your KIOSAWAN PIN</Text>
        <OTPInputView
        style={{width: '80%', height: 200}}
        pinCount={6}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled = {(pin) => _handlePINFulfilled(pin)}
    />
    </View>
    );
}

export default LoginVerification

const styles = StyleSheet.create({
    container : {
        height : height*3/5,
        alignItems : "center"
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