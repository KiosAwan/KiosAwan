import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    Text
} from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';

//Redux Actions
import { addVerifyOTP } from '../../redux/actions/actionsRegistration'

//Functions
import { sendVerifyOTP, sendPhoneNumber } from '../../utils/unauthhelper';
import BarStatus from '../../components/BarStatus';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';


const VerifyOTPRegister = (props) => {
    const dispatch = useDispatch()
    const RegisterOTP = useSelector(state => state.Registration)
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    let [countdown, setCountdown] = useState(59)

    //Render when get intro screen
    useEffect(() => {
        _firstRender()
    }, [])

    //Function disabling button and set timer 
    const _firstRender = () => {
        let waktu = 58
        const a = setInterval(
            () => {
                if (waktu == 0) {
                    clearInterval(a)
                }
                setCountdown(waktu--)
            },
            1000
        );
        setTimeout(() => {
            setIsResendDisabled(false)
        }, 60000)
    }

    //Resend Code function
    const _resendCode = async () => {
        props.sendOTP()
        setIsResendDisabled(true)
        let theTimer = 58
        const a = setInterval(
            () => {
                if (theTimer == 0) {
                    clearInterval(a)
                }
                setCountdown(theTimer--)
            },
            1000
        );
        setTimeout(() => {
            setIsResendDisabled(false)
        }, 60000)

    }

    return (
        <View style={styles.container}>
            <BarStatus />
            <Text style={{ marginTop: 10, ...FontList.titleFont, color: ColorsList.greySoft }}>Masukkan kode OTP </Text>
            <Text style={{ marginTop: 10, ...FontList.titleFont, color: ColorsList.greySoft }}>OTP telah dikirim melalui SMS ke nomor HP Anda </Text>
            <CodeInput
                keyboardType="numeric"
                activeColor='black'
                inactiveColor='grey'
                codeLength={4}
                size={40}
                autoFocus
                onFulfill={(code) => props.otpFulfilled(code)}
            />
            {isResendDisabled ?
                <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft, marginTop: 70 }}>RESEND ({countdown} s)</Text> :
                <TouchableOpacity onPress={_resendCode} style={{ marginTop: 70 }}>
                    <Text style={{ ...FontList.titleFont, color: "blue" }}>Resend</Text>
                </TouchableOpacity>
            }
        </View>
    );
}

export default VerifyOTPRegister

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
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