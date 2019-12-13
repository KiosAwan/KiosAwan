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
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';

const MenuSettingUbahNoHPInputOTP = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [showedNumber, setShowedNumber] = useState('')
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    const [otpCode, setOtpCode] = useState()
    let [countdown, setCountdown] = useState(59)
    useEffect(() => {
        _sendOTP()
        setTimeout(() => {
            _firstRender()
        }, 1000)
    }, [])

    const _sendOTP = async () => {
        // await 
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
        setOtpCode(code)
    }
    const _nextBtn = () => {
        navigation.navigate('MenuSettingUbahNoHP', {
            OTP: otpCode
        })
    }
    return (
        <View style={styles.container}>
            <GlobalHeader
                onPressBack={_handleBack}
                title="Ubah No. HP"
            />
            <View style={{ alignItems: "center", height: 175, backgroundColor: 'white', margin: 30 }}>
                <Text style={{ paddingTop: 20 }}>Masukkan Kode</Text>
                <Text>Kode telah dikirim ke email anda</Text>
                <CodeInput
                    keyboardType="numeric"
                    activeColor='black'
                    inactiveColor='grey'
                    codeLength={6}
                    size={40}
                    autoFocus
                    onFulfill={(code) => setOtpCode(code)}
                />
                {isResendDisabled ?
                    <Text style={{ marginBottom: 15, color: 'black' }}>Resend in {countdown} s</Text> :
                    <Text onPress={_resendCode} style={{ marginBottom: 15, color: 'blue' }}>Resend Code</Text>}
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_nextBtn}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="LANJUT"
                />
            </View>
        </View>
    )
}


export default MenuSettingUbahNoHPInputOTP;

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
