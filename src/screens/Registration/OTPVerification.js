import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import { 
    View, 
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { 
    Text
} from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input'

//Redux Actions
import { addVerifyOTP, clearAllRegistration } from '../../redux/actions/actionsRegistration'

//Functions
import { sendVerifyOTP , sendPhoneNumber} from '../../utils/unauthhelper';

const height = Dimensions.get('window').height

const VerifyOTPRegister = (props) => {
    const dispatch = useDispatch()
    const RegisterOTP = useSelector(state => state.Registration)

    const [userData , setUserData] = useState('')
    const [isResendDisabled , setIsResendDisabled] = useState(true)
    let [countdown , setCountdown ] = useState(59)

    //Render when get intro screen
    useEffect(() => { 
        _firstRender()
    }, [])

    //Function disabling button and set timer 
    const _firstRender = () => {
        let waktu = 58
        const a = setInterval(
            () => {
                if(waktu == 0) {
                    clearInterval(a)
                }
            setCountdown(waktu--)
        },
        1000
        );
        setTimeout( () => {
            setIsResendDisabled(false)
        },60000)
        }

    //Sending OTP code to server
    const _handleOTPFulfilled = async (code) => {
        props.closeSheet()
        await dispatch(addVerifyOTP(code))
        const data = {
            phone_number : "62"+RegisterOTP.phone_number,
            otp : code
        }
        const res = await sendVerifyOTP(data)
        console.log(res)
        if(res.status == 200) {
            props.navigateTo() 
        }else {
            if(res.status == 400) {
                alert(res.data.msg)
            }  
        }
    }

    //Resend Code function
    const _resendCode = async () => {   
        setIsResendDisabled(true)
        let theTimer = 58
        const a = setInterval(
            () => {
                if(theTimer == 0) {
                    clearInterval(a)
                }
            setCountdown(theTimer--)
        },
        1000
        );
        setTimeout( () => {
            setIsResendDisabled(false)
        },60000)
        const data = {
            phone_number : "62"+RegisterOTP.phone_number,
        }
        await sendPhoneNumber(data)
    }

    return (
    <View style={styles.container}>
        <Text style={{marginTop :10}}>Masukkan kode OTP , check Inbox anda</Text>
        <OTPInputView
        style={{width: '80%', height: 100}}
        pinCount={4}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled = {(code) => _handleOTPFulfilled(code)}
    />
    <TouchableOpacity disabled={isResendDisabled} onPress={_resendCode}>
        <Text style={{color : isResendDisabled ? "grey" : "blue"}}>Resend code</Text>
    </TouchableOpacity>
    <Text>0:{countdown}</Text>
    </View>
    );
}

export default VerifyOTPRegister

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