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

    //Sending OTP code to server
    const _handleOTPFulfilled = async (code) => {
        props.closeSheet()
        await dispatch(addVerifyOTP(code))
        const data = {
            phone_number: "62" + RegisterOTP.phone_number,
            otp: code
        }
        const res = await sendVerifyOTP(data)
        if (res.status == 200) {
            props.navigateTo()
        } else {
            if (res.status == 400) {
                alert(res.data.errors.msg)
            }
        }
    }

    //Resend Code function
    const _resendCode = async () => {
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
        const data = {
            phone_number: "62" + RegisterOTP.phone_number,
        }
        await sendPhoneNumber(data)
    }

    return (
        <View style={styles.container}>
            <BarStatus />
            <Text style={{ marginTop: 10, ...FontList.titleFont, color : ColorsList.greySoft }}>Masukkan kode OTP </Text>
            <Text style={{ marginTop: 10, ...FontList.titleFont, color : ColorsList.greySoft }}>OTP telah dikirim melalui SMS ke nomor HP Anda </Text>
            <CodeInput
                keyboardType="numeric"
                activeColor='black'
                inactiveColor='grey'
                codeLength={4}
                size={40}
                autoFocus
                onFulfill={(code) => _handleOTPFulfilled(code)}
            />
            {isResendDisabled ?
                <Text style={{...FontList.titleFont, color:ColorsList.greySoft, marginTop: 70 }}>RESEND ({countdown} s)</Text> :
                <TouchableOpacity onPress={_resendCode} style={{ marginTop: 70 }}>
                    <Text style={{...FontList.titleFont, color: "blue" }}>Resend</Text>
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