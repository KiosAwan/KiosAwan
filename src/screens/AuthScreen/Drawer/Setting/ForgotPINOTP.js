import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux'
import CodeInput from 'react-native-confirmation-code-input';
import { GlobalHeader } from '../../../../components/Header/Header';
import { showPhoneNumber } from '../../../../utils/unauthhelper';
import { ColorsList } from '../../../../styles/colors';
import { sendOTPAuth, verifyOTPAuth } from '../../../../utils/authhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const ForgotPINOTP = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [showedNumber, setShowedNumber] = useState('')
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    let [countdown, setCountdown] = useState(59)

    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            _formatPhoneNum()
            _firstRender()
        }, 1000)
    }, [])

    const _sendOTP = async () => {
        const data = {
            phone_number: User.data.phone_number
        }
        const res = await sendOTPAuth(data)
        if (res.status == 400) {
            setAlertMessage(res.data.errors.msg)
            setAlert(true)
        }
    }

    const _formatPhoneNum = () => {
        setShowedNumber(showPhoneNumber(User.data.phone_number.slice(2, User.data.length)))
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
        _sendOTP()
    }

    const _handleOTPFulfilled = async (code) => {
        const data = {
            phone_number: User.data.phone_number,
            otp: code
        }
        const res = await verifyOTPAuth(data)
        if (res.status == 400) {
            setAlertMessage(res.data.errors.msg)
            setAlert(true)
        }
        else if (res.status == 200) {
            navigation.navigate('/drawer/settings/forgot-pin/new-pin')
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
                title="Lupa PIN"
            />
            <View style={{ alignItems: "center", height: 160, backgroundColor: 'white', margin: 30 }}>
                <Text style={{ paddingTop: 20 }}>A 4 digit code has been sent to</Text>
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
                    <Text style={{ color: 'black', paddingTop: 30 }}>Resend in {countdown} s</Text> :
                    <Text onPress={_resendCode} style={{ color: 'blue', paddingTop: 60 }}>Resend Code</Text>}
            </View>
        </View>
    )
}


export default ForgotPINOTP;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorsList.authBackground
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
