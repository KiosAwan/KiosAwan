import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useSelector, useDispatch} from 'react-redux'
import { showPhoneNumber } from '../../../../utils/unauthhelper';
import { GlobalHeader } from '../../../../components/Header/Header';
import CodeInput from 'react-native-confirmation-code-input';
import { ColorsList } from '../../../../styles/colors';

const MenuSettingUbahEmail = ({ navigation }) => {
	const User = useSelector(state => state.User)
    const [showedNumber, setShowedNumber] = useState('')
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    let [countdown, setCountdown] = useState(59)
    useEffect(() => {
        _sendOTP()
        setTimeout(() => {
            _formatPhoneNum()
            _firstRender()
        }, 1000)
    }, [])

    const _sendOTP = async() => {
        // await 
    }

    const _formatPhoneNum = () => {
        setShowedNumber(showPhoneNumber(User.data.phone_number.slice(2,User.data.length)))
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

        // const data = {
        //     phone_number: "62" + phoneNumber,
        // }
        // await sendOTP(data)
    }

    const _handleOTPFulfilled = async (code) => {
        // const data = {
        //     phone_number: "62" + phoneNumber,
        //     otp: code
        // }
        // const res = await sendVerifyOTP(data)
        // if (res.status == 400) {
        //     alert(res.data.errors.msg)
        // }
        // else if (res.status == 200) {
            navigation.navigate("")
        // }
        // else {
        //     alert("Ada yang salah , cek koneksi anda")
        // }
    }
    return (
        <View style={styles.container}>
            <GlobalHeader
                onPressBack={_handleBack}
                title="Ubah Email"
            />
            <View style={{ alignItems: "center", height : 160, backgroundColor : 'white', margin : 30 }}>
                <Text style={{ paddingTop: 20 }}>OTP telah dikirimkan ke nomer</Text>
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

export default MenuSettingUbahEmail


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : ColorsList.authBackground
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
