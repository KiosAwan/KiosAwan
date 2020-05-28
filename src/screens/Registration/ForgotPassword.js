import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux'
import CodeInput from 'react-native-confirmation-code-input';

import { GlobalHeader } from '../../components/Header/Header';
import { sendVerifyOTP, showPhoneNumber, sendOTP } from '../../utils/unauthhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from 'src/styles/colors';

const ForgotPassword = ({ navigation }) => {
    const phoneNumber = useSelector(state => state.Registration.phone_number)
    const [showedNumber, setShowedNumber] = useState('')
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    let [countdown, setCountdown] = useState(59)

    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    useEffect(() => {
        _formatPhoneNum()
        _firstRender()
    }, [])

    const _formatPhoneNum = () => {
        setShowedNumber(showPhoneNumber(phoneNumber))
    }

    const _handleBack = () => {
        navigation.goBack()
    }

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

    const _resendCode = async () => {
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
        setIsResendDisabled(true)

        const data = {
            phone_number: "62" + phoneNumber,
        }
        await sendOTP(data)
    }

    const _handleOTPFulfilled = async (code) => {
        const data = {
            phone_number: "62" + phoneNumber,
            otp: code
        }
        const res = await sendVerifyOTP(data)
        if (res.status == 400) {
            setAlertMessage(res.data.errors.msg)
            setAlert(true)
        }
        else if (res.status == 200) {
            navigation.navigate('/unauth/login/forgot-password/new-password-1')
        }
        else {
            alert("Ada yang salah , cek koneksi anda")
        }
    }
    return (
        <View style={styles.container}>
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <GlobalHeader
                onPressBack={_handleBack}
                title="Forgot Password"
            />
            <View style={{ alignItems: "center" }}>
                <Text style={{ paddingTop: 20 }}>Kode OTP telah dikirimkan ke</Text>
                <Text>62-{showedNumber}</Text>
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
                    <Text style={{ color: 'grey', paddingTop: 60 }}>Resend in {countdown} s</Text> :
                    <Text onPress={_resendCode} style={{ color: 'blue', paddingTop: 60 }}>Resend Code</Text>}
            </View>
        </View>
    )
}


export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },
    borderStyleHighLighted: {
        borderColor: ColorsList.successHighlight,
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    underlineStyleHighLighted: {
        borderColor: ColorsList.successHighlight,
    },
})
